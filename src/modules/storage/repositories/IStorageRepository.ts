import type { Storage } from "../domain/storage";
import type { StorageAmount } from "../domain/storageAmount";
import type { StorageFruitId } from "../domain/storageFruitId";
import type { StorageLimit } from "../domain/storageLimit";

export interface IStorageRepository {
	getStorageByFruitId(fruitId: StorageFruitId): Promise<Storage>;
	saveStorage(storage: Storage): Promise<void>;
	deleteStorageByFruitId(fruitId: StorageFruitId): Promise<Storage>;
	updateStorageByFruitId(fruitId: StorageFruitId, limit: StorageLimit): Promise<Storage>;
	storeAmountByFruitId(fruitId: StorageFruitId, amount: StorageAmount): Promise<Storage>;
	removeAmountByFruitId(fruitId: StorageFruitId, amount: StorageAmount): Promise<Storage>;
}
