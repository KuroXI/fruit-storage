import { Result } from "../../../shared/core/Result";
import type { Fruit } from "../domain/fruit";
import { FruitStorage } from "../domain/fruitStorage";
import type { Storage } from "../domain/storage";

export interface IFruitStorageFactoryCreateProps {
	fruit: Fruit;
	storage: Storage;
}

export class FruitStorageFactory {
	static create(props: IFruitStorageFactoryCreateProps): Result<FruitStorage> {
		const fruitStorageOrError = FruitStorage.create(
			{
				fruit: props.fruit,
				limit: props.storage.limit,
				amount: props.storage.amount,
			},
			props.storage.storageId.getValue(),
		);
		if (fruitStorageOrError.isFailure) {
			return Result.fail(fruitStorageOrError.getErrorValue().toString());
		}

		return Result.ok<FruitStorage>(fruitStorageOrError.getValue());
	}
}
