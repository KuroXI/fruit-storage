import { Result } from "../../../shared/core/Result";
import { Storage } from "../domain/storage";
import type { StorageAmount } from "../domain/storageAmount";
import type { StorageFruitId } from "../domain/storageFruitId";
import type { StorageId } from "../domain/storageId";
import type { StorageLimit } from "../domain/storageLimit";

export interface IStorageFactoryCreateProps {
	storageId: StorageId;
	fruitId: StorageFruitId;
	limit: StorageLimit;
	amount: StorageAmount;
}

export class StorageFactory {
	static create(props: IStorageFactoryCreateProps): Result<Storage> {
		const storageOrError = Storage.create(
			{ fruitId: props.fruitId, limit: props.limit, amount: props.amount },
			props.storageId.getValue(),
		);
		if (storageOrError.isFailure) {
			return Result.fail(storageOrError.getErrorValue().toString());
		}

		return Result.ok<Storage>(storageOrError.getValue());
	}
}
