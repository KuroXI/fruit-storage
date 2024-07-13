import type { Storage } from "../domain/storage";
import type { StorageFruitId } from "../domain/storageFruitId";
import type { StorageLimit } from "../domain/storageLimit";

export interface IStorageRepository {
	getStorage(fruitId: StorageFruitId): Promise<Storage>;
	save(storage: Storage): Promise<void>;
	delete(fruitId: StorageFruitId): Promise<Storage>;
	update(fruitId: StorageFruitId, limit: StorageLimit): Promise<Storage>;
	store(fruitId: StorageFruitId, amount: number): Promise<Storage>;
}
