import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Fruit } from "../../domain/fruit";
import { FruitDescription } from "../../domain/fruitDescription";
import { FruitId } from "../../domain/fruitId";
import { FruitName } from "../../domain/fruitName";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { Storage } from "../../domain/storage";
import { StorageAmount } from "../../domain/storageAmount";
import { StorageFruitId } from "../../domain/storageFruitId";
import { StorageId } from "../../domain/storageId";
import { StorageLimit } from "../../domain/storageLimit";
import { FruitFactory, type IFruitFactoryCreateProps } from "../../factory/fruitFactory";
import { FruitStorageFactory } from "../../factory/fruitStorageFactory";
import { type IStorageFactoryCreateProps, StorageFactory } from "../../factory/storageFactory";
import type { FruitRepository } from "../../repositories/implementations/fruitRepository";
import type { StorageRepository } from "../../repositories/implementations/storageRepository";
import type { ICreateFruitStorageDTO } from "./createFruitStorageDTO";
import { CreateFruitStorageErrors } from "./createFruitStorageErrors";
import { CreateFruitStorageOutbox } from "./createFruitStorageOutbox";
import type { CreateFruitStorageResponse } from "./createFruitStorageResponse";

export class CreateFruitStorage
	implements UseCase<ICreateFruitStorageDTO, CreateFruitStorageResponse>
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

	async execute(request: ICreateFruitStorageDTO): Promise<CreateFruitStorageResponse> {
		try {
			await this._unitOfWork.startTransaction();

			const validateRequestFruitData = await this._validateRequestFruitData({
				name: request.name,
				description: request.description,
			});
			if (validateRequestFruitData.isFailure) {
				return left(validateRequestFruitData);
			}

			const fruit = await this._createFruit(validateRequestFruitData.getValue());
			await this._saveFruit(fruit.getValue());

			const validateRequestStorageData = await this._validateRequestStorageData({
				fruitId: fruit.getValue().fruitId.getStringValue(),
				limit: request.limitOfFruitToBeStored,
			});
			if (validateRequestStorageData.isFailure) {
				return left(validateRequestStorageData);
			}

			const storage = await this._createStorage(validateRequestStorageData.getValue());
			await this._saveStorage(storage.getValue());

			const fruitStorageOrError = await this._createFruitStorage(
				fruit.getValue(),
				storage.getValue(),
			);
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
			fruitId: FruitId;
			name: FruitName;
			description: FruitDescription;
		}>
	> {
		const fruitIdOrError = FruitId.create(new UniqueEntityID());
		const fruitNameOrError = FruitName.create({ value: request.name });
		const fruitDescriptionOrError = FruitDescription.create({
			value: request.description,
		});

		const fruitCombineResult = Result.combine([
			fruitIdOrError,
			fruitNameOrError,
			fruitDescriptionOrError,
		]);
		if (fruitCombineResult.isFailure) {
			return Result.fail(fruitCombineResult.getErrorValue());
		}

		const fruitExist = await this._isFruitExist(fruitNameOrError.getValue());
		if (fruitExist) {
			return Result.fail(
				new CreateFruitStorageErrors.FruitAlreadyExistError(
					fruitNameOrError.getValue().value,
				).getErrorValue().message,
			);
		}

		return Result.ok({
			fruitId: fruitIdOrError.getValue(),
			name: fruitNameOrError.getValue(),
			description: fruitDescriptionOrError.getValue(),
		});
	}

	private async _validateRequestStorageData(request: {
		fruitId: string;
		limit: number;
	}): Promise<
		Result<{
			storageId: StorageId;
			fruitId: StorageFruitId;
			amount: StorageAmount;
			limit: StorageLimit;
		}>
	> {
		const storageIdOrError = StorageId.create(new UniqueEntityID());
		const storageFruitIdOrError = StorageFruitId.create({
			value: request.fruitId,
		});
		const storageLimitOrError = StorageLimit.create({ value: request.limit });
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

		if (this._validateStorageAmount(storageLimitOrError.getValue().value)) {
			return Result.fail(
				new CreateFruitStorageErrors.LimitHasToBePositiveNumber().getErrorValue().message,
			);
		}

		return Result.ok({
			storageId: storageIdOrError.getValue(),
			fruitId: storageFruitIdOrError.getValue(),
			amount: storageAmountOrError.getValue(),
			limit: storageLimitOrError.getValue(),
		});
	}

	private async _createFruit(props: IFruitFactoryCreateProps): Promise<Result<Fruit>> {
		return FruitFactory.create(props);
	}

	private async _createStorage(props: IStorageFactoryCreateProps): Promise<Result<Storage>> {
		return StorageFactory.create(props);
	}

	private async _createFruitStorage(fruit: Fruit, storage: Storage): Promise<Result<FruitStorage>> {
		return FruitStorageFactory.create({ fruit, storage });
	}

	private async _isFruitExist(name: FruitName): Promise<boolean> {
		return await this._fruitRepository.exists(name);
	}

	private _validateStorageAmount(amount: number): boolean {
		return amount < 1;
	}

	private async _saveFruit(fruit: Fruit): Promise<void> {
		await this._fruitRepository.save(fruit);
	}

	private async _saveStorage(storage: Storage): Promise<void> {
		await this._storageRepository.save(storage);
	}

	private async _emitOutboxEvent(fruitStorage: FruitStorage): Promise<void> {
		await CreateFruitStorageOutbox.emit(fruitStorage);
	}
}
