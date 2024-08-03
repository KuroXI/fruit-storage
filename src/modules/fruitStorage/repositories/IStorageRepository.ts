import type { Storage } from "../domain/storage";
import type { StorageAmount } from "../domain/storageAmount";
import type { StorageFruitId } from "../domain/storageFruitId";
import type { StorageLimit } from "../domain/storageLimit";

export interface IStorageRepository {
	exists(fruitId: StorageFruitId): Promise<boolean>;
	getStorageByFruitId(fruitId: StorageFruitId): Promise<Storage>;
	save(storage: Storage): Promise<void>;
	deleteByFruitId(fruitId: StorageFruitId): Promise<Storage>;
	updateLimitByFruitId(fruitId: StorageFruitId, limit: StorageLimit): Promise<Storage>;
	storeAmountByFruitId(fruitId: StorageFruitId, amount: StorageAmount): Promise<Storage>;
	removeAmountByFruitId(fruitId: StorageFruitId, amount: StorageAmount): Promise<Storage>;
}
