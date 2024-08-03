import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Fruit } from "../../domain/fruit";
import { FruitName } from "../../domain/fruitName";
import { FruitStorage } from "../../domain/fruitStorage";
import type { Storage } from "../../domain/storage";
import { StorageAmount } from "../../domain/storageAmount";
import { StorageFruitId } from "../../domain/storageFruitId";
import type { FruitRepository } from "../../repositories/implementations/fruitRepository";
import type { StorageRepository } from "../../repositories/implementations/storageRepository";
import type { IRemoveAmountFromFruitStorageDTO } from "./removeAmountFromFruitStorageDTO";
import { RemoveAmountFromFruitStorageErrors } from "./removeAmountFromFruitStorageErrors";
import { RemoveAmountFromFruitStorageOutbox } from "./removeAmountFromFruitStorageOutbox";
import type { RemoveAmountFromFruitStorageResponse } from "./removeAmountFromFruitStorageResponse";

export class RemoveAmountFromFruitStorage
	implements UseCase<IRemoveAmountFromFruitStorageDTO, RemoveAmountFromFruitStorageResponse>
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
		request: IRemoveAmountFromFruitStorageDTO,
	): Promise<RemoveAmountFromFruitStorageResponse> {
		try {
			await this._unitOfWork.startTransaction();

			const validateRequestFruitData = await this._validateRequestFruitData({ name: request.name });
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
			const storage = await this._removeAmountByFruitId(fruitId, amount);

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
				new RemoveAmountFromFruitStorageErrors.FruitDoesNotExistError(
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
		const storageFruitIdOrError = StorageFruitId.create({ value: request.fruitId });
		const storageAmountOrError = StorageAmount.create({ value: request.amount });

		const storageCombineResult = Result.combine([storageFruitIdOrError, storageAmountOrError]);
		if (storageCombineResult.isFailure) {
			return Result.fail(storageCombineResult.getErrorValue());
		}

		const storage = await this._getStorageByFruitId(storageFruitIdOrError.getValue());

		if (!storage) {
			return Result.fail(
				new RemoveAmountFromFruitStorageErrors.StorageDoesNotExistError(
					request.fruitId,
				).getErrorValue().message,
			);
		}

		if (storage.amount.value < storageAmountOrError.getValue().value) {
			return Result.fail(
				new RemoveAmountFromFruitStorageErrors.AmountLargerThanStoredAmountError().getErrorValue()
					.message,
			);
		}

		return Result.ok({
			fruitId: storageFruitIdOrError.getValue(),
			amount: storageAmountOrError.getValue(),
		});
	}

	private async _createFruitStorage(fruit: Fruit, storage: Storage): Promise<Result<FruitStorage>> {
		const fruitStorageOrError = FruitStorage.create(
			{ fruit, limit: storage.limit, amount: storage.amount },
			storage.storageId.getValue(),
		);
		if (fruitStorageOrError.isFailure) {
			return Result.fail(fruitStorageOrError.getErrorValue().toString());
		}

		return Result.ok<FruitStorage>(fruitStorageOrError.getValue());
	}

	private async _removeAmountByFruitId(
		fruitId: StorageFruitId,
		amount: StorageAmount,
	): Promise<Storage> {
		return await this._storageRepository.removeAmountByFruitId(fruitId, amount);
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
		RemoveAmountFromFruitStorageOutbox.emit(fruitStorage);
	}
}
