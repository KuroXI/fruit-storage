import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Storage } from "../domain/storage";
import { StorageAmount } from "../domain/storageAmount";
import { StorageFruitId } from "../domain/storageFruitId";
import { StorageLimit } from "../domain/storageLimit";

export class StorageMapper {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public static toDomain(raw: any): Storage {
		const storageOrError = Storage.create(
			{
				fruitId: StorageFruitId.create({ value: raw.fruitId }).getValue(),
				limit: StorageLimit.create({ value: raw.limit }).getValue(),
				amount: StorageAmount.create({ value: raw.amount }).getValue(),
			},
			new UniqueEntityID(raw.id),
		);

		if (storageOrError.isFailure) {
			return storageOrError.getErrorValue();
		}

		return storageOrError.getValue();
	}

	public static toPersistence(storage: Storage) {
		return {
			id: storage.storageId.getValue(),
			fruitId: storage.fruitId.value,
			limit: storage.limit.value,
			amount: storage.amount.value,
		};
	}
}
