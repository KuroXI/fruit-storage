import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Storage } from "../../domain/storage";
import { StorageAmount } from "../../domain/storageAmount";
import { StorageFruitId } from "../../domain/storageFruitId";
import { StorageId } from "../../domain/storageId";
import { StorageLimit } from "../../domain/storageLimit";
import type { IStorageRepository } from "../../repositories/IStorageRepository";
import type { ICreateStorageDTO } from "./createStorageDTO";
import { CreateStorageErrors } from "./createStorageErrors";
import type { CreateStorageResponse } from "./createStorageResponse";

export class CreateStorage implements UseCase<ICreateStorageDTO, CreateStorageResponse> {
	private _storageRepository: IStorageRepository;

	constructor(storageRepository: IStorageRepository) {
		this._storageRepository = storageRepository;
	}

	public async execute(request: ICreateStorageDTO): Promise<CreateStorageResponse> {
		try {
			const validateRequest = await this._validateRequest(request);
			if (validateRequest.isFailure) {
				return left(validateRequest);
			}

			const storage = await this._createStorage(validateRequest.getValue());

			await this._saveStorage(storage.getValue());

			return right(Result.ok<Storage>(storage.getValue()));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}

	private async _validateRequest(request: ICreateStorageDTO): Promise<
		Result<{
			storageId: StorageId;
			fruitId: StorageFruitId;
			limit: StorageLimit;
			amount: StorageAmount;
		}>
	> {
		const storageIdOrError = StorageId.create(new UniqueEntityID());
		const storageFruitIdOrError = StorageFruitId.create({ value: request.fruitId });
		const storageLimitOrError = StorageLimit.create({ value: request.limitOfFruitToBeStored });
		const storageAmountOrError = StorageAmount.create({ value: 0 });

		const storageCombineResult = Result.combine([
			storageIdOrError,
			storageFruitIdOrError,
			storageLimitOrError,
			storageAmountOrError,
		]);
		if (storageCombineResult.isFailure) {
			return Result.fail(storageCombineResult.getErrorValue());
		}

		if (storageLimitOrError.getValue().value < 1) {
			return Result.fail(
				new CreateStorageErrors.LimitHasToBePositiveNumber().getErrorValue().message,
			);
		}

		return Result.ok({
			storageId: storageIdOrError.getValue(),
			fruitId: storageFruitIdOrError.getValue(),
			limit: storageLimitOrError.getValue(),
			amount: storageAmountOrError.getValue(),
		});
	}

	private async _createStorage(props: {
		storageId: StorageId;
		fruitId: StorageFruitId;
		limit: StorageLimit;
		amount: StorageAmount;
	}): Promise<Result<Storage>> {
		const storageOrError = Storage.create(
			{ fruitId: props.fruitId, limit: props.limit, amount: props.amount },
			props.storageId.getValue(),
		);
		if (storageOrError.isFailure) {
			return Result.fail(storageOrError.getErrorValue().toString());
		}

		return Result.ok(storageOrError.getValue());
	}

	private async _saveStorage(storage: Storage): Promise<void> {
		await this._storageRepository.saveStorage(storage);
	}
}
