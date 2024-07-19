import type { IStorageRepo } from "../storageRepo";
import type { FruitStorageModel } from "../../../../shared/infrastructure/database/mongoose/models/FruitStorage";
import type { Storage } from "../../domain/storage";
import type { StorageFruitId } from "../../domain/storageFruitId";
import type { StorageLimit } from "../../domain/storageLimit";
import { StorageMapper } from "../../mappers/storageMapper";

export class StorageRepository implements IStorageRepo {
	private _models: typeof FruitStorageModel;

	constructor(models: typeof FruitStorageModel) {
		this._models = models;
	}

	async getStorage(fruitId: StorageFruitId): Promise<Storage> {
		const storage = await this._models.findOne({ fruitId: fruitId.value }).lean();

		return StorageMapper.toDomain(storage);
	}

	async save(storage: Storage): Promise<void> {
		const rawStorageMapper = StorageMapper.toPersistence(storage);

		await this._models.create(rawStorageMapper);
	}

	async delete(fruitId: StorageFruitId): Promise<Storage> {
		const storage = await this._models.findOneAndDelete({ fruitId: fruitId.value }).lean();

		return StorageMapper.toDomain(storage);
	}

	async update(fruitId: StorageFruitId, limit: StorageLimit): Promise<Storage> {
		const storage = await this._models
			.findOneAndUpdate({ fruitId: fruitId.value }, { limit: limit.value }, { new: true })
			.lean();

		return StorageMapper.toDomain(storage);
	}

	async store(fruitId: StorageFruitId, amount: number): Promise<Storage> {
		const storage = await this._models
			.findOneAndUpdate({ fruitId: fruitId.value }, { amount }, { new: true })
			.lean();

		return StorageMapper.toDomain(storage);
	}
}
