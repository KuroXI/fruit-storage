import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Storage } from "../../domain/storage";
import { StorageFruitId } from "../../domain/storageFruitId";
import type { IStorageRepository } from "../../repositories/IStorageRepository";
import type { DeleteStorageDTO } from "./deleteStorageDTO";
import { DeleteStorageErrors } from "./deleteStorageErrors";
import { DeleteStorageOutbox } from "./deleteStorageOutbox";
import type { DeleteStorageResponse } from "./deleteStorageResponse";

export class DeleteStorage implements UseCase<DeleteStorageDTO, DeleteStorageResponse> {
	private _storageRepository: IStorageRepository;
	private _unitOfWork: UnitOfWork;

	constructor(storageRepository: IStorageRepository, unitOfWork: UnitOfWork) {
		this._storageRepository = storageRepository;
		this._unitOfWork = unitOfWork;
	}

	public async execute(request: DeleteStorageDTO): Promise<DeleteStorageResponse> {
		try {
			await this._unitOfWork.start();

			const storageFruitIdOrError = StorageFruitId.create({ value: request.fruidId });

			const fruitCombineResult = Result.combine([storageFruitIdOrError]);
			if (fruitCombineResult.isFailure) {
				return left(Result.fail<DeleteStorage>(fruitCombineResult.getErrorValue()));
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

			await this._unitOfWork.commit();
			return right(Result.ok<Storage>(deletedStorage));
		} catch (error) {
			await this._unitOfWork.abort();
			return left(new AppError.UnexpectedError(error));
		} finally {
			await this._unitOfWork.end();
		}
	}
}
