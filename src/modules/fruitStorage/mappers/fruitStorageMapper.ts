import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Fruit } from "../domain/fruit";
import { FruitDescription } from "../domain/fruitDescription";
import { FruitName } from "../domain/fruitName";
import { FruitStorage } from "../domain/fruitStorage";
import { StorageAmount } from "../domain/storageAmount";
import { StorageLimit } from "../domain/storageLimit";

export class FruitStorageMapper {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public static toDomain(raw: any): FruitStorage {
		const fruit = Fruit.create(
			{
				name: FruitName.create({ value: raw.name }).getValue(),
				description: FruitDescription.create({
					value: raw.description,
				}).getValue(),
			},
			new UniqueEntityID(raw.id),
		);

		const fruitStorageOrError = FruitStorage.create(
			{
				fruit: fruit.getValue(),
				limit: StorageLimit.create({ value: raw.limit }).getValue(),
				amount: StorageAmount.create({ value: raw.amount }).getValue(),
			},
			new UniqueEntityID(raw.storageId),
		);

		if (fruitStorageOrError.isFailure) {
			return fruitStorageOrError.getErrorValue();
		}

		return fruitStorageOrError.getValue();
	}

	public static toPersistence(fruitStorage: FruitStorage) {
		return {
			id: fruitStorage.storageId.getValue(),
			fruit: {
				id: fruitStorage.fruitId,
				name: fruitStorage.fruit.name.value,
				description: fruitStorage.fruit.description.value,
			},
			limit: fruitStorage.limit.value,
			amount: fruitStorage.amount.value,
		};
	}
}
