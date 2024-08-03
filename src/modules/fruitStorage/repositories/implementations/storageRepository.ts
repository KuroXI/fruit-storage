import type { StorageModel } from "../../../../shared/infrastructure/database/mongoose/models/Storage";
import type { Storage } from "../../domain/storage";
import type { StorageAmount } from "../../domain/storageAmount";
import type { StorageFruitId } from "../../domain/storageFruitId";
import type { StorageLimit } from "../../domain/storageLimit";
import { StorageMapper } from "../../mappers/storageMapper";
import type { IStorageRepository } from "../IStorageRepository";

export class StorageRepository implements IStorageRepository {
	private _models: typeof StorageModel;

	constructor(models: typeof StorageModel) {
		this._models = models;
	}

	async exists(fruitId: StorageFruitId): Promise<boolean> {
		const storage = await this._models.findOne({ fruitId: fruitId.value }).lean();

		return !!storage;
	}

	async getStorageByFruitId(fruitId: StorageFruitId): Promise<Storage> {
		const storage = await this._models.findOne({ fruitId: fruitId.value }).lean();

		return StorageMapper.toDomain(storage);
	}

	async save(storage: Storage): Promise<void> {
		const rawStorageMapper = StorageMapper.toPersistence(storage);

		await this._models.create(rawStorageMapper);
	}

	async deleteByFruitId(fruitId: StorageFruitId): Promise<Storage> {
		const storage = await this._models.findOneAndDelete({ fruitId: fruitId.value }).lean();

		return StorageMapper.toDomain(storage);
	}

	async updateLimitByFruitId(fruitId: StorageFruitId, limit: StorageLimit): Promise<Storage> {
		const storage = await this._models
			.findOneAndUpdate({ fruitId: fruitId.value }, { limit: limit.value }, { new: true })
			.lean();

		return StorageMapper.toDomain(storage);
	}

	async storeAmountByFruitId(fruitId: StorageFruitId, amount: StorageAmount): Promise<Storage> {
		const storage = await this._models
			.findOneAndUpdate(
				{ fruitId: fruitId.value },
				{
					$inc: {
						amount: amount.value,
					},
				},
				{ new: true },
			)
			.lean();

		return StorageMapper.toDomain(storage);
	}

	async removeAmountByFruitId(fruitId: StorageFruitId, amount: StorageAmount): Promise<Storage> {
		const storage = await this._models.findOneAndUpdate(
			{ fruitId: fruitId.value },
			{
				$inc: {
					amount: -amount.value,
				},
			},
			{ new: true },
		);

		return StorageMapper.toDomain(storage);
	}
}
