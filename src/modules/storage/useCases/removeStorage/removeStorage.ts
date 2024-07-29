import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Storage } from "../../domain/storage";
import { StorageFruitId } from "../../domain/storageFruitId";
import { StorageLimit } from "../../domain/storageLimit";
import type { IStorageRepository } from "../../repositories/IStorageRepository";
import type { RemoveStorageDTO } from "./removeStorageDTO";
import { RemoveStorageErrors } from "./removeStorageErrors";
import { RemoveStorageOutbox } from "./removeStorageOutbox";
import type { RemoveStorageResponse } from "./removeStorageResponse";

export class RemoveStorage implements UseCase<RemoveStorageDTO, RemoveStorageResponse> {
	private _storageRepository: IStorageRepository;
	private _unitOfWork: UnitOfWork;

	constructor(storageRepository: IStorageRepository, unitOfWork: UnitOfWork) {
		this._storageRepository = storageRepository;
		this._unitOfWork = unitOfWork;
	}

	public async execute(request: RemoveStorageDTO): Promise<RemoveStorageResponse> {
		try {
			await this._unitOfWork.start();

			const storageFruitIdOrError = StorageFruitId.create({ value: request.fruidId });
			const storageAmountOrError = StorageLimit.create({ value: request.amount });

			const storageCombineResult = Result.combine([storageFruitIdOrError, storageAmountOrError]);
			if (storageCombineResult.isFailure) {
				return left(Result.fail<RemoveStorage>(storageCombineResult.getErrorValue()));
			}

			const storage = await this._storageRepository.getStorage(storageFruitIdOrError.getValue());
			if (!storage) {
				return left(
					Result.fail(
						new RemoveStorageErrors.StorageDoesNotExistError(request.fruidId).getErrorValue()
							.message,
					),
				);
			}

			if (storage.amount.value < storageAmountOrError.getValue().value) {
				return left(
					Result.fail(
						new RemoveStorageErrors.AmountLargerThanStoredAmountError().getErrorValue().message,
					),
				);
			}

			const updatedStorage = await this._storageRepository.store(
				storage.fruitId,
				storage.amount.value - storageAmountOrError.getValue().value,
			);

			RemoveStorageOutbox.emit(updatedStorage);

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
