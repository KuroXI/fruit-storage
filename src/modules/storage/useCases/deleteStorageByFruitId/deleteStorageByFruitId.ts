import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Storage } from "../../domain/storage";
import { StorageFruitId } from "../../domain/storageFruitId";
import type { IStorageRepository } from "../../repositories/IStorageRepository";
import type { IDeleteStorageByFruitIdDTO } from "./deleteStorageByFruitIdDTO";
import { DeleteStorageByFruitIdErrors } from "./deleteStorageByFruitIdErrors";
import type { DeleteStorageByFruitIdResponse } from "./deleteStorageByFruitIdResponse";

export class DeleteStorageByFruitId
	implements UseCase<IDeleteStorageByFruitIdDTO, DeleteStorageByFruitIdResponse>
{
	private _storageRepository: IStorageRepository;
	private _unitOfWork: UnitOfWork;

	constructor(storageRepository: IStorageRepository, unitOfWork: UnitOfWork) {
		this._storageRepository = storageRepository;
		this._unitOfWork = unitOfWork;
	}

	public async execute(
		request: IDeleteStorageByFruitIdDTO,
	): Promise<DeleteStorageByFruitIdResponse> {
		try {
			await this._unitOfWork.startTransaction();

			const validateRequest = await this._validateRequest(request);
			if (validateRequest.isFailure) {
				await this._unitOfWork.abortTransaction();
				return left(validateRequest);
			}

			const deletedStorage = await this._deleteStorageByFruitId(validateRequest.getValue());

			await this._unitOfWork.commitTransaction();

			return right(Result.ok<Storage>(deletedStorage));
		} catch (error) {
			await this._unitOfWork.abortTransaction();
			return left(new AppError.UnexpectedError(error));
		} finally {
			await this._unitOfWork.endTransaction();
		}
	}

	private async _validateRequest(
		request: IDeleteStorageByFruitIdDTO,
	): Promise<Result<StorageFruitId>> {
		const storageFruitIdOrError = StorageFruitId.create({ value: request.fruitId });
		if (storageFruitIdOrError.isFailure) {
			return Result.fail(storageFruitIdOrError.getErrorValue().toString());
		}

		const storage = await this._getStorageByFruitId(storageFruitIdOrError.getValue());
		if (!storage) {
			return Result.fail(
				new DeleteStorageByFruitIdErrors.StorageDoesNotExistError(request.fruitId).getErrorValue()
					.message,
			);
		}

		return Result.ok(storageFruitIdOrError.getValue());
	}

	private async _getStorageByFruitId(fruitId: StorageFruitId): Promise<Storage> {
		return await this._storageRepository.getStorageByFruitId(fruitId.value);
	}

	private async _deleteStorageByFruitId(fruitId: StorageFruitId): Promise<Storage> {
		return await this._storageRepository.deleteStorageByFruitId(fruitId);
	}
}
