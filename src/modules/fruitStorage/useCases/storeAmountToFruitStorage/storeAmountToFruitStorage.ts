import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Fruit } from "../../domain/fruit";
import { FruitName } from "../../domain/fruitName";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { Storage } from "../../domain/storage";
import { StorageAmount } from "../../domain/storageAmount";
import { StorageFruitId } from "../../domain/storageFruitId";
import { FruitStorageFactory } from "../../factory/fruitStorageFactory";
import type { FruitRepository } from "../../repositories/implementations/fruitRepository";
import type { StorageRepository } from "../../repositories/implementations/storageRepository";
import type { IStoreAmountToFruitStorageDTO } from "./storeAmountToFruitStorageDTO";
import { StoreAmountToFruitStorageErrors } from "./storeAmountToFruitStorageErrors";
import { StoreAmountToFruitStorageOutbox } from "./storeAmountToFruitStorageOutbox";
import type { StoreAmountToFruitStorageResponse } from "./storeAmountToFruitStorageResponse";

export class StoreAmountToFruitStorage
	implements UseCase<IStoreAmountToFruitStorageDTO, StoreAmountToFruitStorageResponse>
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

	async execute(
		request: IStoreAmountToFruitStorageDTO,
	): Promise<StoreAmountToFruitStorageResponse> {
		try {
			await this._unitOfWork.startTransaction();

			const validateRequestFruitData = await this._validateRequestFruitData({
				name: request.name,
			});
			if (validateRequestFruitData.isFailure) {
				return left(validateRequestFruitData);
			}

			const fruit = await this._getFruitByFruitName(validateRequestFruitData.getValue().name);

			const validateRequestStorageData = await this._validateRequestStorageData({
				fruitId: fruit.fruitId.getStringValue(),
				amount: request.amount,
			});
			if (validateRequestStorageData.isFailure) {
				return left(validateRequestStorageData);
			}

			const { fruitId, amount } = validateRequestStorageData.getValue();
			const storage = await this._storeAmountByFruitId(fruitId, amount);

			const fruitStorageOrError = this._createFruitStorage(fruit, storage);
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
				new StoreAmountToFruitStorageErrors.FruitDoesNotExistError(
					fruitNameOrError.getValue().value,
				).getErrorValue().message,
			);
		}

		return Result.ok({ name: fruitNameOrError.getValue() });
	}

	private async _validateRequestStorageData(request: {
		fruitId: string;
		amount: number;
	}): Promise<
		Result<{
			fruitId: StorageFruitId;
			amount: StorageAmount;
		}>
	> {
		const storageFruitIdOrError = StorageFruitId.create({
			value: request.fruitId,
		});
		const storageAmountOrError = StorageAmount.create({
			value: request.amount,
		});

		const storageCombineResult = Result.combine([storageFruitIdOrError, storageAmountOrError]);
		if (storageCombineResult.isFailure) {
			return Result.fail(storageCombineResult.getErrorValue());
		}

		const storage = await this._getStorageByFruitId(storageFruitIdOrError.getValue());

		if (!storage) {
			return Result.fail(
				new StoreAmountToFruitStorageErrors.StorageDoesNotExistError(
					request.fruitId,
				).getErrorValue().message,
			);
		}

		const amount = storage.amount.value + storageAmountOrError.getValue().value;
		if (this._isAmountLaterThanLimit(amount, storage.limit.value)) {
			return Result.fail(
				new StoreAmountToFruitStorageErrors.AmountLargerThanLimitError().getErrorValue().message,
			);
		}

		return Result.ok({
			fruitId: storageFruitIdOrError.getValue(),
			amount: storageAmountOrError.getValue(),
		});
	}

	private _createFruitStorage(fruit: Fruit, storage: Storage): Result<FruitStorage> {
		return FruitStorageFactory.create({ fruit, storage });
	}

	private async _storeAmountByFruitId(
		fruitId: StorageFruitId,
		amount: StorageAmount,
	): Promise<Storage> {
		return await this._storageRepository.storeAmountByFruitId(fruitId, amount);
	}

	private _isAmountLaterThanLimit(amount: number, limit: number): boolean {
		return limit < amount;
	}

	private async _isFruitExist(name: FruitName): Promise<boolean> {
		return await this._fruitRepository.exists(name);
	}

	private async _getFruitByFruitName(fruitName: FruitName): Promise<Fruit> {
		return await this._fruitRepository.getFruitByName(fruitName);
	}

	private async _getStorageByFruitId(fruitId: StorageFruitId): Promise<Storage> {
		return await this._storageRepository.getStorageByFruitId(fruitId);
	}

	private async _emitOutboxEvent(fruitStorage: FruitStorage): Promise<void> {
		await StoreAmountToFruitStorageOutbox.emit(fruitStorage);
	}
}
