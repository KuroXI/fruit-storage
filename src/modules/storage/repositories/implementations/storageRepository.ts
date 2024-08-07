import type { StorageModel } from "../../../../shared/infrastructure/database/mongoose/models/Storage";
import type { Storage } from "../../domain/storage";
import type { StorageFruitId } from "../../domain/storageFruitId";
import type { StorageLimit } from "../../domain/storageLimit";
import { StorageMapper } from "../../mappers/storageMapper";
import type { IStorageRepository } from "../IStorageRepository";

export class StorageRepository implements IStorageRepository {
	private _models: typeof StorageModel;

	constructor(models: typeof StorageModel) {
		this._models = models;
	}

	async getStorageByFruitId(fruitId: string): Promise<Storage> {
		const storage = await this._models.findOne({ fruitId: fruitId }).lean();

		return StorageMapper.toDomain(storage);
	}

	async saveStorage(storage: Storage): Promise<void> {
		const rawStorageMapper = StorageMapper.toPersistence(storage);

		await this._models.create(rawStorageMapper);
	}

	async deleteStorageByFruitId(fruitId: StorageFruitId): Promise<Storage> {
		const storage = await this._models.findOneAndDelete({ fruitId: fruitId.value }).lean();

		return StorageMapper.toDomain(storage);
	}

	async updateStorageByFruitId(fruitId: StorageFruitId, limit: StorageLimit): Promise<Storage> {
		const storage = await this._models
			.findOneAndUpdate({ fruitId: fruitId.value }, { limit: limit.value }, { new: true })
			.lean();

		return StorageMapper.toDomain(storage);
	}
}
