import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Storage } from "../../domain/storage";
import { StorageFruitId } from "../../domain/storageFruitId";
import { StorageLimit } from "../../domain/storageLimit";
import type { IStorageRepository } from "../../repositories/IStorageRepository";
import type { UpdateStorageDTO } from "./updateStorageDTO";
import { UpdateStorageErrors } from "./updateStorageErrors";
import { UpdateStorageOutbox } from "./updateStorageOutbox";
import type { UpdateStorageResponse } from "./updateStorageResponse";

export class UpdateStorage implements UseCase<UpdateStorageDTO, UpdateStorageResponse> {
	private _storageRepository: IStorageRepository;
	private _unitOfWork: UnitOfWork;

	constructor(storageRepository: IStorageRepository, unitOfWork: UnitOfWork) {
		this._storageRepository = storageRepository;
		this._unitOfWork = unitOfWork;
	}

	public async execute(request: UpdateStorageDTO): Promise<UpdateStorageResponse> {
		try {
			await this._unitOfWork.start();

			const storageFruitIdOrError = StorageFruitId.create({ value: request.fruidId });
			const storageLimitOrError = StorageLimit.create({ value: request.limit });

			const storageCombineResult = Result.combine([storageFruitIdOrError, storageLimitOrError]);
			if (storageCombineResult.isFailure) {
				return left(Result.fail<UpdateStorage>(storageCombineResult.getErrorValue()));
			}

			const storage = await this._storageRepository.getStorage(storageFruitIdOrError.getValue());
			if (!storage) {
				return left(
					Result.fail(
						new UpdateStorageErrors.StorageDoesNotExistError(request.fruidId).getErrorValue()
							.message,
					),
				);
			}

			if (storage.limit.value < 1) {
				return left(
					Result.fail(new UpdateStorageErrors.LimitHasToBePositiveNumber().getErrorValue().message),
				);
			}

			const updatedStorage = await this._storageRepository.update(
				storage.fruitId,
				storageLimitOrError.getValue(),
			);

			UpdateStorageOutbox.emit(updatedStorage);

			await this._unitOfWork.commit();
			return right(Result.ok<Storage>(updatedStorage));
		} catch (error) {
			await this._unitOfWork.abort();
			return left(new AppError.UnexpectedError(error));
		} finally {
			await this._unitOfWork.end();
		}
	}
}
