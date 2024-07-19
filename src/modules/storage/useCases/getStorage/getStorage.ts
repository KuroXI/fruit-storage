import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { Storage } from "../../domain/storage";
import { StorageFruitId } from "../../domain/storageFruitId";
import type { IStorageRepo } from "../../repositories/storageRepo";
import type { GetStorageDTO } from "./getStorageDTO";
import type { GetStorageResponse } from "./getStorageResponse";

export class GetStorage implements UseCase<GetStorageDTO, GetStorageResponse> {
	private _storageRepository: IStorageRepo;

	constructor(storageRepository: IStorageRepo) {
		this._storageRepository = storageRepository;
	}

	public async execute(request: GetStorageDTO): Promise<GetStorageResponse> {
		try {
			const storageFruitIdOrError = StorageFruitId.create({ value: request.fruitId });

			const fruitCombineResult = Result.combine([storageFruitIdOrError]);
			if (fruitCombineResult.isFailure) {
				return left(Result.fail(fruitCombineResult.getErrorValue()));
			}

			const storage = await this._storageRepository.getStorage(storageFruitIdOrError.getValue());

			return right(Result.ok<Storage>(storage));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}
}
