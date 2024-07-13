import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Storage } from "../../domain/storage";
import { StorageAmount } from "../../domain/storageAmount";
import { StorageFruitId } from "../../domain/storageFruitId";
import { StorageId } from "../../domain/storageId";
import { StorageLimit } from "../../domain/storageLimit";
import type { IStorageRepository } from "../../repositories";
import type { CreateStorageDTO } from "./createStorageDTO";
import { CreateStorageErrors } from "./createStorageErrors";
import { CreateStorageOutbox } from "./createStorageOutbox";
import type { CreateStorageResponse } from "./createStorageResponse";

export class CreateStorage implements UseCase<CreateStorageDTO, CreateStorageResponse> {
	private _storageRepository: IStorageRepository;

	constructor(storageRepository: IStorageRepository) {
		this._storageRepository = storageRepository;
	}

	public async execute(request: CreateStorageDTO): Promise<CreateStorageResponse> {
		try {
			const storageIdOrError = StorageId.create(new UniqueEntityID());
			const storageFruitIdOrError = StorageFruitId.create({ value: request.fruitId });
			const storageLimitOrError = StorageLimit.create({ value: request.limitOfFruitToBeStored });
			const storageAmountOrError = StorageAmount.create({ value: 0 });

			const fruitCombineResult = Result.combine([
				storageIdOrError,
				storageFruitIdOrError,
				storageLimitOrError,
				storageAmountOrError,
			]);
			if (fruitCombineResult.isFailure) {
				return left(Result.fail(fruitCombineResult.getErrorValue()));
			}

			if (storageLimitOrError.getValue().value < 1) {
				return left(
					Result.fail(new CreateStorageErrors.LimitHasToBePositiveNumber().getErrorValue().message),
				);
			}

			const storage = Storage.create(
				{
					fruitId: storageFruitIdOrError.getValue(),
					limit: storageLimitOrError.getValue(),
					amount: storageAmountOrError.getValue(),
				},
				storageIdOrError.getValue().getValue(),
			);

			await this._storageRepository.save(storage.getValue());

			CreateStorageOutbox.emit(storage.getValue());

			return right(Result.ok<Storage>(storage.getValue()));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}
}
