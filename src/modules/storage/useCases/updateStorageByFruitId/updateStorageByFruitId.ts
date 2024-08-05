import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { Storage } from "../../domain/storage";
import { StorageFruitId } from "../../domain/storageFruitId";
import { StorageLimit } from "../../domain/storageLimit";
import type { IStorageRepository } from "../../repositories/IStorageRepository";
import type { IUpdateStorageByFruitIdDTO } from "./updateStorageByFruitIdDTO";
import { UpdateStorageByFruitIdErrors } from "./updateStorageByFruitIdErrors";
import type { UpdateStorageByFruitIdResponse } from "./updateStorageByFruitIdResponse";

export class UpdateStorageByFruitId
	implements UseCase<IUpdateStorageByFruitIdDTO, UpdateStorageByFruitIdResponse>
{
	private _storageRepository: IStorageRepository;

	constructor(storageRepository: IStorageRepository) {
		this._storageRepository = storageRepository;
	}

	public async execute(
		request: IUpdateStorageByFruitIdDTO,
	): Promise<UpdateStorageByFruitIdResponse> {
		try {
			const validateRequest = await this._validateRequest(request);
			if (validateRequest.isFailure) {
				return left(validateRequest);
			}

			const { storageFruitId, limit } = validateRequest.getValue();
			const updatedStorage = await this._updateStorage(storageFruitId, limit);

			return right(Result.ok<Storage>(updatedStorage));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}

	private async _validateRequest(request: IUpdateStorageByFruitIdDTO): Promise<
		Result<{
			storageFruitId: StorageFruitId;
			limit: StorageLimit;
		}>
	> {
		const storageFruitIdOrError = StorageFruitId.create({ value: request.fruidId });
		const storageLimitOrError = StorageLimit.create({ value: request.limit });

		const storageCombineResult = Result.combine([storageFruitIdOrError, storageLimitOrError]);
		if (storageCombineResult.isFailure) {
			return Result.fail(storageCombineResult.getErrorValue());
		}

		const storage = await this._getStorageByFruitId(storageFruitIdOrError.getValue());
		if (!storage) {
			return Result.fail(
				new UpdateStorageByFruitIdErrors.StorageDoesNotExistError(request.fruidId).getErrorValue()
					.message,
			);
		}

		if (storage.limit.value < 1) {
			return Result.fail(
				new UpdateStorageByFruitIdErrors.LimitHasToBePositiveNumber().getErrorValue().message,
			);
		}

		return Result.ok({
			storageFruitId: storageFruitIdOrError.getValue(),
			limit: storageLimitOrError.getValue(),
		});
	}

	private async _getStorageByFruitId(fruitId: StorageFruitId): Promise<Storage> {
		return await this._storageRepository.getStorageByFruitId(fruitId);
	}

	private async _updateStorage(fruitId: StorageFruitId, limit: StorageLimit): Promise<Storage> {
		return await this._storageRepository.updateStorageByFruitId(fruitId, limit);
	}
}
