import type { Storage } from "../domain/storage";
import type { StorageFruitId } from "../domain/storageFruitId";
import type { StorageLimit } from "../domain/storageLimit";

export interface IStorageRepository {
	getStorageByFruitId(fruitId: string): Promise<Storage>;
	saveStorage(storage: Storage): Promise<void>;
	deleteStorageByFruitId(fruitId: StorageFruitId): Promise<Storage>;
	updateStorageByFruitId(fruitId: StorageFruitId, limit: StorageLimit): Promise<Storage>;
}
