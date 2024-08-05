import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { Storage } from "../../domain/storage";
import { StorageAmount } from "../../domain/storageAmount";
import { StorageFruitId } from "../../domain/storageFruitId";
import type { IStorageRepository } from "../../repositories/IStorageRepository";
import type { IStoreAmountToStorageDTO } from "./storeAmountToStorageDTO";
import { StoreAmountToStorageErrors } from "./storeAmountToStorageErrors";
import type { StoreAmountToStorageResponse } from "./storeAmountToStorageResponse";

export class StoreAmountToStorage
	implements UseCase<IStoreAmountToStorageDTO, StoreAmountToStorageResponse>
{
	private _storageRepository: IStorageRepository;

	constructor(storageRepository: IStorageRepository) {
		this._storageRepository = storageRepository;
	}

	public async execute(request: IStoreAmountToStorageDTO): Promise<StoreAmountToStorageResponse> {
		try {
			const validateRequest = await this._validateRequest(request);
			if (validateRequest.isFailure) {
				return left(validateRequest);
			}

			const { fruitId, amount } = validateRequest.getValue();
			const updatedStorage = await this._storeAmountByFruitId(fruitId, amount);

			return right(Result.ok<Storage>(updatedStorage));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}

	private async _validateRequest(request: IStoreAmountToStorageDTO): Promise<
		Result<{
			fruitId: StorageFruitId;
			amount: StorageAmount;
		}>
	> {
		const storageFruitIdOrError = StorageFruitId.create({ value: request.fruidId });
		const storageAmountOrError = StorageAmount.create({ value: request.amount });

		const storageCombineResult = Result.combine([storageFruitIdOrError, storageAmountOrError]);
		if (storageCombineResult.isFailure) {
			return Result.fail(storageCombineResult.getErrorValue());
		}

		const storage = await this._getStorageByFruitId(storageFruitIdOrError.getValue());
		if (!storage) {
			return Result.fail(
				new StoreAmountToStorageErrors.StorageDoesNotExistError(request.fruidId).getErrorValue()
					.message,
			);
		}

		if (storage.limit.value < storage.amount.value + storageAmountOrError.getValue().value) {
			return Result.fail(
				new StoreAmountToStorageErrors.AmountLargerThanLimitError().getErrorValue().message,
			);
		}

		return Result.ok({
			fruitId: storageFruitIdOrError.getValue(),
			amount: storageAmountOrError.getValue(),
		});
	}

	private async _getStorageByFruitId(fruitId: StorageFruitId): Promise<Storage> {
		return await this._storageRepository.getStorageByFruitId(fruitId);
	}

	private async _storeAmountByFruitId(
		fruitId: StorageFruitId,
		amount: StorageAmount,
	): Promise<Storage> {
		return await this._storageRepository.storeAmountByFruitId(fruitId, amount);
	}
}
