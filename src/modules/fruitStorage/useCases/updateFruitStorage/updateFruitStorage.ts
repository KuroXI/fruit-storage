import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Fruit } from "../../domain/fruit";
import { FruitDescription } from "../../domain/fruitDescription";
import { FruitName } from "../../domain/fruitName";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { Storage } from "../../domain/storage";
import { StorageFruitId } from "../../domain/storageFruitId";
import { StorageLimit } from "../../domain/storageLimit";
import { FruitStorageFactory } from "../../factory/fruitStorageFactory";
import type { FruitRepository } from "../../repositories/implementations/fruitRepository";
import type { StorageRepository } from "../../repositories/implementations/storageRepository";
import type { IUpdateFruitStorageDTO } from "./updateFruitStorageDTO";
import { UpdateFruitStorageErrors } from "./updateFruitStorageErrors";
import { UpdateFruitStorageOutbox } from "./updateFruitStorageOutbox";
import type { UpdateFruitStorageResponse } from "./updateFruitStorageResponse";

export class UpdateFruitStorage
	implements UseCase<IUpdateFruitStorageDTO, UpdateFruitStorageResponse>
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

	async execute(request: IUpdateFruitStorageDTO): Promise<UpdateFruitStorageResponse> {
		try {
			await this._unitOfWork.startTransaction();

			const validateRequestFruitData = await this._validateRequestFruitData({
				name: request.name,
				description: request.description,
			});
			if (validateRequestFruitData.isFailure) {
				return left(validateRequestFruitData);
			}

			const fruit = await this._updateFruit(
				validateRequestFruitData.getValue().name,
				validateRequestFruitData.getValue().description,
			);

			const validateRequestStorageData = await this._validateRequestStorageData({
				fruitId: fruit.fruitId.getStringValue(),
				limitOfFruitToBeStored: request.limitOfFruitToBeStored,
			});
			if (validateRequestStorageData.isFailure) {
				return left(validateRequestStorageData);
			}

			const storage = await this._updateStorage(
				validateRequestStorageData.getValue().fruitId,
				validateRequestStorageData.getValue().limit,
			);

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

	private async _validateRequestFruitData(request: {
		name: string;
		description: string;
	}): Promise<
		Result<{
			name: FruitName;
			description: FruitDescription;
		}>
	> {
		const fruitNameOrError = FruitName.create({ value: request.name });
		const fruitDescriptionOrError = FruitDescription.create({
			value: request.description,
		});

		const fruitCombineResult = Result.combine([fruitNameOrError, fruitDescriptionOrError]);
		if (fruitCombineResult.isFailure) {
			return Result.fail(fruitCombineResult.getErrorValue());
		}

		const fruitExist = await this._isFruitExist(fruitNameOrError.getValue());
		if (!fruitExist) {
			return Result.fail(
				new UpdateFruitStorageErrors.FruitDoesNotExistError(
					fruitNameOrError.getValue().value,
				).getErrorValue().message,
			);
		}

		return Result.ok({
			name: fruitNameOrError.getValue(),
			description: fruitDescriptionOrError.getValue(),
		});
	}

	private async _validateRequestStorageData(request: {
		fruitId: string;
		limitOfFruitToBeStored: number;
	}): Promise<
		Result<{
			fruitId: StorageFruitId;
			limit: StorageLimit;
		}>
	> {
		const storageFruitIdOrError = StorageFruitId.create({
			value: request.fruitId,
		});
		const storageLimitOrError = StorageLimit.create({
			value: request.limitOfFruitToBeStored,
		});

		const storageCombineResult = Result.combine([storageFruitIdOrError, storageLimitOrError]);
		if (storageCombineResult.isFailure) {
			return Result.fail(storageCombineResult.getErrorValue());
		}

		if (this._validateStorageAmount(storageLimitOrError.getValue().value)) {
			return Result.fail(
				new UpdateFruitStorageErrors.LimitHasToBePositiveNumber().getErrorValue().message,
			);
		}

		const storageExist = await this._isStorageExist(storageFruitIdOrError.getValue());
		if (!storageExist) {
			return Result.fail(
				new UpdateFruitStorageErrors.StorageDoesNotExistError(
					storageFruitIdOrError.getValue().value,
				).getErrorValue().message,
			);
		}

		return Result.ok({
			fruitId: storageFruitIdOrError.getValue(),
			limit: storageLimitOrError.getValue(),
		});
	}

	private _createFruitStorage(fruit: Fruit, storage: Storage): Result<FruitStorage> {
		return FruitStorageFactory.create({ fruit, storage });
	}

	private async _isFruitExist(name: FruitName): Promise<boolean> {
		return await this._fruitRepository.exists(name);
	}

	private async _isStorageExist(fruitId: StorageFruitId): Promise<boolean> {
		return await this._storageRepository.exists(fruitId);
	}

	private _validateStorageAmount(amount: number): boolean {
		return amount < 1;
	}

	private async _updateFruit(name: FruitName, description: FruitDescription): Promise<Fruit> {
		return await this._fruitRepository.update(name, description);
	}

	private async _updateStorage(fruitId: StorageFruitId, limit: StorageLimit): Promise<Storage> {
		return await this._storageRepository.updateLimitByFruitId(fruitId, limit);
	}

	private async _emitOutboxEvent(fruitStorage: FruitStorage): Promise<void> {
		await UpdateFruitStorageOutbox.emit(fruitStorage);
	}
}
