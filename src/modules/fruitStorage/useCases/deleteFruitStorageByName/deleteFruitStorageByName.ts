import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Fruit } from "../../domain/fruit";
import { FruitName } from "../../domain/fruitName";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { Storage } from "../../domain/storage";
import { StorageFruitId } from "../../domain/storageFruitId";
import { FruitStorageFactory } from "../../factory/fruitStorageFactory";
import type { FruitRepository } from "../../repositories/implementations/fruitRepository";
import type { StorageRepository } from "../../repositories/implementations/storageRepository";
import type { IDeleteFruitStorageByNameDTO } from "./deleteFruitStorageByNameDTO";
import { DeleteFruitStorageByNameErrors } from "./deleteFruitStorageByNameErrors";
import { DeleteFruitStorageByNameOutbox } from "./deleteFruitStorageByNameOutbox";
import type { DeleteFruitStorageByNameResponse } from "./deleteFruitStorageByNameResponse";

export class DeleteFruitStorageByName
	implements UseCase<IDeleteFruitStorageByNameDTO, DeleteFruitStorageByNameResponse>
{
	private _fruitRepository: FruitRepository;
	private _storageRepository: StorageRepository;
	private _unitOfWork: UnitOfWork;

	constructor(
		fruitRepository: FruitRepository,
		storageRepository: StorageRepository,
		unitOfWork: UnitOfWork,
	) {
		this._fruitRepository = fruitRepository;
		this._storageRepository = storageRepository;
		this._unitOfWork = unitOfWork;
	}

	async execute(request: IDeleteFruitStorageByNameDTO): Promise<DeleteFruitStorageByNameResponse> {
		try {
			await this._unitOfWork.startTransaction();

			const validateRequestFruitData = await this._validateRequestFruitData({
				name: request.name,
			});
			if (validateRequestFruitData.isFailure) {
				return left(validateRequestFruitData);
			}

			const fruit = await this._deleteFruitByName(validateRequestFruitData.getValue().name);

			const validateRequestStorageData = await this._validateRequestStorageData({
				fruitId: fruit.fruitId.getStringValue(),
				forceDelete: request.forceDelete,
			});
			if (validateRequestStorageData.isFailure) {
				return left(validateRequestStorageData);
			}

			const storage = await this._deleteStorageByFruitId(
				validateRequestStorageData.getValue().fruitId,
			);

			const fruitStorageOrError = await this._createFruitStorage(fruit, storage);
			if (fruitStorageOrError.isFailure) {
				return left(fruitStorageOrError);
			}

			await this._emitOutboxEvent(fruitStorageOrError.getValue());

			await this._unitOfWork.commitTransaction();

			return right(Result.ok<FruitStorage>(fruitStorageOrError.getValue()));
		} catch (error) {
			await this._unitOfWork.abortTransaction();
			return left(new AppError.UnexpectedError(error));
		} finally {
			await this._unitOfWork.endTransaction();
		}
	}

	private async _validateRequestFruitData(request: { name: string }): Promise<
		Result<{ name: FruitName }>
	> {
		const fruitNameOrError = FruitName.create({ value: request.name });
		if (fruitNameOrError.isFailure) {
			return Result.fail(fruitNameOrError.getErrorValue().toString());
		}

		const fruitExist = await this._isFruitExist(fruitNameOrError.getValue());
		if (!fruitExist) {
			return Result.fail(
				new DeleteFruitStorageByNameErrors.FruitDoesNotExistError(
					fruitNameOrError.getValue().value,
				).getErrorValue().message,
			);
		}

		return Result.ok({ name: fruitNameOrError.getValue() });
	}

	private async _validateRequestStorageData(request: {
		fruitId: string;
		forceDelete: boolean;
	}): Promise<Result<{ fruitId: StorageFruitId }>> {
		const storageFruitIdOrError = StorageFruitId.create({
			value: request.fruitId,
		});
		if (storageFruitIdOrError.isFailure) {
			return Result.fail(storageFruitIdOrError.getErrorValue().toString());
		}

		const storage = await this._getStorageByFruitId(storageFruitIdOrError.getValue());

		if (!storage) {
			return Result.fail(
				new DeleteFruitStorageByNameErrors.StorageDoesNotExistError(request.fruitId).getErrorValue()
					.message,
			);
		}

		if (storage.amount.value > 0 && !request.forceDelete) {
			return Result.fail(
				new DeleteFruitStorageByNameErrors.StorageHasAmountError().getErrorValue().message,
			);
		}

		return Result.ok({
			fruitId: storageFruitIdOrError.getValue(),
		});
	}

	private async _createFruitStorage(fruit: Fruit, storage: Storage): Promise<Result<FruitStorage>> {
		return FruitStorageFactory.create({ fruit, storage });
	}

	private async _deleteFruitByName(name: FruitName): Promise<Fruit> {
		return await this._fruitRepository.deleteByName(name);
	}

	private async _deleteStorageByFruitId(fruitId: StorageFruitId): Promise<Storage> {
		return await this._storageRepository.deleteByFruitId(fruitId);
	}

	private async _isFruitExist(name: FruitName): Promise<boolean> {
		return await this._fruitRepository.exists(name);
	}

	private async _getStorageByFruitId(fruitId: StorageFruitId): Promise<Storage> {
		return await this._storageRepository.getStorageByFruitId(fruitId);
	}

	private async _emitOutboxEvent(fruitStorage: FruitStorage): Promise<void> {
		await DeleteFruitStorageByNameOutbox.emit(fruitStorage);
	}
}
