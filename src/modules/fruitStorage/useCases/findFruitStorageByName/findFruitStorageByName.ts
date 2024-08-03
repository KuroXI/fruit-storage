import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { Fruit } from "../../domain/fruit";
import { FruitName } from "../../domain/fruitName";
import { FruitStorage } from "../../domain/fruitStorage";
import type { Storage } from "../../domain/storage";
import { StorageFruitId } from "../../domain/storageFruitId";
import type { FruitRepository } from "../../repositories/implementations/fruitRepository";
import type { StorageRepository } from "../../repositories/implementations/storageRepository";
import type { IFindFruitStorageByNameDTO } from "./findFruitStorageByNameDTO";
import { FindFruitStorageByNameErrors } from "./findFruitStorageByNameErrors";
import type { FindFruitStorageByNameResponse } from "./findFruitStorageByNameResponse";

export class FindFruitStorageByName implements UseCase<IFindFruitStorageByNameDTO, FindFruitStorageByNameResponse> {
	private _fruitRepository: FruitRepository;
	private _storageRepository: StorageRepository;

	constructor(fruitRepository: FruitRepository, storageRepository: StorageRepository) {
		this._fruitRepository = fruitRepository;
		this._storageRepository = storageRepository;
	}

	async execute(request: IFindFruitStorageByNameDTO): Promise<FindFruitStorageByNameResponse> {
		try {
			const validateRequestFruitData = await this._validateRequestFruitData({ name: request.name });
			if (validateRequestFruitData.isFailure) {
				return left(validateRequestFruitData);
			}

			const fruit = await this._getFruitByFruitName(validateRequestFruitData.getValue().name);

			const validateRequestStorageData = await this._validateRequestStorageData({
				fruitId: fruit.fruitId.getStringValue(),
			});
			if (validateRequestStorageData.isFailure) {
				return left(validateRequestStorageData);
			}

			const storage = await this._getStorageByFruitId(validateRequestStorageData.getValue().fruitId);

			const fruitStorageOrError = await this._createFruitStorage(fruit, storage);
			if (fruitStorageOrError.isFailure) {
				return left(fruitStorageOrError);
			}

			return right(Result.ok<FruitStorage>(fruitStorageOrError.getValue()));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}

	private async _validateRequestFruitData(request: { name: string }): Promise<Result<{ name: FruitName }>> {
		const fruitNameOrError = FruitName.create({ value: request.name });
		if (fruitNameOrError.isFailure) {
			return Result.fail(fruitNameOrError.getErrorValue().toString());
		}

		const fruitExist = await this._isFruitExist(fruitNameOrError.getValue());
		if (!fruitExist) {
			return Result.fail(
				new FindFruitStorageByNameErrors.FruitDoesNotExistError(fruitNameOrError.getValue().value).getErrorValue()
					.message,
			);
		}

		return Result.ok({ name: fruitNameOrError.getValue() });
	}

	private async _validateRequestStorageData(request: { fruitId: string }): Promise<
		Result<{ fruitId: StorageFruitId }>
	> {
		const storageFruitIdOrError = StorageFruitId.create({ value: request.fruitId });
		if (storageFruitIdOrError.isFailure) {
			return Result.fail(storageFruitIdOrError.getErrorValue().toString());
		}

		const storage = await this._getStorageByFruitId(storageFruitIdOrError.getValue());

		if (!storage) {
			return Result.fail(
				new FindFruitStorageByNameErrors.StorageDoesNotExistError(request.fruitId).getErrorValue().message,
			);
		}
		return Result.ok({ fruitId: storageFruitIdOrError.getValue() });
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

	private async _isFruitExist(name: FruitName): Promise<boolean> {
		return await this._fruitRepository.exists(name);
	}

	private async _getFruitByFruitName(fruitName: FruitName): Promise<Fruit> {
		return await this._fruitRepository.getFruitByName(fruitName);
	}

	private async _getStorageByFruitId(fruitId: StorageFruitId): Promise<Storage> {
		return await this._storageRepository.getStorageByFruitId(fruitId);
	}
}
