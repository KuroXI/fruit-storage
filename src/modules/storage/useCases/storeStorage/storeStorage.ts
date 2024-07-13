import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { Storage } from "../../domain/storage";
import { StorageFruitId } from "../../domain/storageFruitId";
import { StorageLimit } from "../../domain/storageLimit";
import type { IStorageRepository } from "../../repositories";
import type { StoreStorageDTO } from "./storeStorageDTO";
import { StoreStorageErrors } from "./storeStorageErrors";
import { StoreStorageOutbox } from "./storeStorageOutbox";
import type { StoreStorageResponse } from "./storeStorageResponse";

export class StoreStorage implements UseCase<StoreStorageDTO, StoreStorageResponse> {
	private _storageRepository: IStorageRepository;

	constructor(storageRepository: IStorageRepository) {
		this._storageRepository = storageRepository;
	}

	public async execute(request: StoreStorageDTO): Promise<StoreStorageResponse> {
		try {
			const storageFruitIdOrError = StorageFruitId.create({ value: request.fruidId });
			const storageAmountOrError = StorageLimit.create({ value: request.amount });

			const fruitCombineResult = Result.combine([storageFruitIdOrError, storageAmountOrError]);
			if (fruitCombineResult.isFailure) {
				return left(Result.fail(fruitCombineResult.getErrorValue()));
			}

			const storage = await this._storageRepository.getStorage(storageFruitIdOrError.getValue());
			if (!storage) {
				return left(
					Result.fail(
						new StoreStorageErrors.StorageDoesNotExistError(request.fruidId).getErrorValue()
							.message,
					),
				);
			}

			if (storage.limit.value < storage.amount.value + storageAmountOrError.getValue().value) {
				return left(
					Result.fail(new StoreStorageErrors.AmountLargerThanLimitError().getErrorValue().message),
				);
			}

			const updatedStorage = await this._storageRepository.store(
				storage.fruitId,
				storageAmountOrError.getValue().value + storage.amount.value,
			);

			StoreStorageOutbox.emit(updatedStorage);

			return right(Result.ok<Storage>(updatedStorage));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}
}
