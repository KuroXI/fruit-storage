import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { Storage } from "../../domain/storage";
import { StorageFruitId } from "../../domain/storageFruitId";
import type { IStorageRepo } from "../../repositories/storageRepo";
import type { DeleteStorageDTO } from "./deleteStorageDTO";
import { DeleteStorageErrors } from "./deleteStorageErrors";
import { DeleteStorageOutbox } from "./deleteStorageOutbox";
import type { DeleteStorageResponse } from "./deleteStorageResponse";

export class DeleteStorage implements UseCase<DeleteStorageDTO, DeleteStorageResponse> {
	private _storageRepository: IStorageRepo;

	constructor(storageRepository: IStorageRepo) {
		this._storageRepository = storageRepository;
	}

	public async execute(request: DeleteStorageDTO): Promise<DeleteStorageResponse> {
		try {
			const storageFruitIdOrError = StorageFruitId.create({ value: request.fruidId });

			const fruitCombineResult = Result.combine([storageFruitIdOrError]);
			if (fruitCombineResult.isFailure) {
				return left(Result.fail(fruitCombineResult.getErrorValue()));
			}

			const storage = await this._storageRepository.getStorage(storageFruitIdOrError.getValue());
			if (!storage) {
				return left(
					Result.fail(
						new DeleteStorageErrors.StorageDoesNotExistError(request.fruidId).getErrorValue()
							.message,
					),
				);
			}

			if (storage.amount.value > 0 && !request.forceDelete) {
				return left(
					Result.fail(new DeleteStorageErrors.StorageHasAmountError().getErrorValue().message),
				);
			}

			const deletedStorage = await this._storageRepository.delete(storage.fruitId);

			DeleteStorageOutbox.emit(deletedStorage);

			return right(Result.ok<Storage>(deletedStorage));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}
}
