import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Storage } from "../domain/storage";
import { StorageFruitId } from "../domain/storageFruitId";
import { StorageLimit } from "../domain/storageLimit";

export class StorageMapper {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public static toDomain(raw: any): Storage {
		const storageOrError = Storage.create(
			{
				fruitId: StorageFruitId.create({ value: raw.fruitId }).getValue(),
				limit: StorageLimit.create({ value: raw.limit }).getValue(),
			},
			new UniqueEntityID(raw._id),
		);

		if (storageOrError.isFailure) {
			console.log(storageOrError.getErrorValue());
		}

		return storageOrError.getValue();
	}

	public static toPersistence(storage: Storage) {
		return {
			_id: storage.storageId.getValue(),
			fruitId: storage.fruitId.value,
			limit: storage.limit.value,
		};
	}
}
