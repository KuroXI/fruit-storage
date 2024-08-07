import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Storage } from "../../domain/storage";
import { StorageLimit } from "../../domain/storageLimit";
import { StorageFactory } from "../../factory/storageFactory";
import type { IStorageRepository } from "../../repositories/IStorageRepository";
import type { ICreateStorageDTO } from "./createStorageDTO";
import { CreateStorageErrors } from "./createStorageErrors";
import type { CreateStorageResponse } from "./createStorageResponse";

export class CreateStorage implements UseCase<ICreateStorageDTO, CreateStorageResponse> {
	private _storageRepository: IStorageRepository;
	private _unitOfWork: UnitOfWork;

	constructor(storageRepository: IStorageRepository, unitOfWork: UnitOfWork) {
		this._storageRepository = storageRepository;
		this._unitOfWork = unitOfWork;
	}

	public async execute(request: ICreateStorageDTO): Promise<CreateStorageResponse> {
		try {
			await this._unitOfWork.startTransaction();

			const validateRequest = await this._validateRequest(request);
			if (validateRequest.isFailure) {
				await this._unitOfWork.abortTransaction();
				return left(validateRequest);
			}

			const storageOrError = this._createStorage(request.fruitId, request.limitOfFruitToBeStored);
			if (storageOrError.isFailure) {
				await this._unitOfWork.abortTransaction();
				return left(storageOrError);
			}

			await this._saveStorage(storageOrError.getValue());

			await this._unitOfWork.commitTransaction();

			return right(Result.ok<Storage>(storageOrError.getValue()));
		} catch (error) {
			await this._unitOfWork.abortTransaction();
			return left(new AppError.UnexpectedError(error));
		} finally {
			await this._unitOfWork.endTransaction();
		}
	}

	private async _validateRequest(request: ICreateStorageDTO): Promise<Result<void>> {
		const storageLimitOrError = StorageLimit.create({ value: request.limitOfFruitToBeStored });
		if (storageLimitOrError.isFailure) {
			return Result.fail(storageLimitOrError.getErrorValue().toString());
		}

		if (storageLimitOrError.getValue().value < 1) {
			return Result.fail(
				new CreateStorageErrors.LimitHasToBePositiveNumber().getErrorValue().message,
			);
		}

		return Result.ok();
	}

	private _createStorage(fruitId: string, limit: number): Result<Storage> {
		return StorageFactory.create({ fruitId, limit });
	}

	private async _saveStorage(storage: Storage): Promise<void> {
		await this._storageRepository.saveStorage(storage);
	}
}
