import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { Storage } from "../../domain/storage";
import { StorageFruitId } from "../../domain/storageFruitId";
import type { IStorageRepository } from "../../repositories/IStorageRepository";
import type { IGetStorageByFruitIdDTO } from "./getStorageByFruitIdDTO";
import { GetStorageByFruitIdErrors } from "./getStorageByFruitIdErrors";
import type { GetStorageByFruitIdResponse } from "./getStorageByFruitIdResponse";

export class GetStorageByFruitId
	implements UseCase<IGetStorageByFruitIdDTO, GetStorageByFruitIdResponse>
{
	private _storageRepository: IStorageRepository;

	constructor(storageRepository: IStorageRepository) {
		this._storageRepository = storageRepository;
	}

	public async execute(request: IGetStorageByFruitIdDTO): Promise<GetStorageByFruitIdResponse> {
		try {
			const validateRequest = await this._validateRequest(request);
			if (validateRequest.isFailure) {
				return left(validateRequest);
			}

			const storage = await this._getStorageByFruitId(validateRequest.getValue());

			return right(Result.ok<Storage>(storage));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}

	private async _validateRequest(
		request: IGetStorageByFruitIdDTO,
	): Promise<Result<StorageFruitId>> {
		const storageFruitIdOrError = StorageFruitId.create({ value: request.fruitId });
		if (storageFruitIdOrError.isFailure) {
			return Result.fail(storageFruitIdOrError.getErrorValue().toString());
		}

		const storage = await this._getStorageByFruitId(storageFruitIdOrError.getValue());
		if (!storage) {
			return Result.fail(
				new GetStorageByFruitIdErrors.StorageDoesNotExistError(request.fruitId).getErrorValue()
					.message,
			);
		}

		return Result.ok(storageFruitIdOrError.getValue());
	}

	private async _getStorageByFruitId(fruitId: StorageFruitId): Promise<Storage> {
		return await this._storageRepository.getStorageByFruitId(fruitId);
	}
}
