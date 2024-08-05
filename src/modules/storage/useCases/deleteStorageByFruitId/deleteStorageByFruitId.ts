import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
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

	constructor(storageRepository: IStorageRepository) {
		this._storageRepository = storageRepository;
	}

	public async execute(
		request: IDeleteStorageByFruitIdDTO,
	): Promise<DeleteStorageByFruitIdResponse> {
		try {
			const validateRequest = await this._validateRequest(request);
			if (validateRequest.isFailure) {
				return left(validateRequest);
			}

			const deletedStorage = await this._deleteStorageByFruitId(validateRequest.getValue());

			return right(Result.ok<Storage>(deletedStorage));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}

	private async _validateRequest(
		request: IDeleteStorageByFruitIdDTO,
	): Promise<Result<StorageFruitId>> {
		const storageFruitIdOrError = StorageFruitId.create({ value: request.fruidId });
		if (storageFruitIdOrError.isFailure) {
			return Result.fail(storageFruitIdOrError.getErrorValue().toString());
		}

		const storage = await this._getStorageByFruitId(storageFruitIdOrError.getValue());
		if (!storage) {
			return Result.fail(
				new DeleteStorageByFruitIdErrors.StorageDoesNotExistError(request.fruidId).getErrorValue()
					.message,
			);
		}

		if (storage.amount.value > 0 && !request.forceDelete) {
			return Result.fail(
				new DeleteStorageByFruitIdErrors.StorageHasAmountError().getErrorValue().message,
			);
		}

		return Result.ok(storageFruitIdOrError.getValue());
	}

	private async _getStorageByFruitId(fruitId: StorageFruitId): Promise<Storage> {
		return await this._storageRepository.getStorageByFruitId(fruitId);
	}

	private async _deleteStorageByFruitId(fruitId: StorageFruitId): Promise<Storage> {
		return await this._storageRepository.deleteStorageByFruitId(fruitId);
	}
}
