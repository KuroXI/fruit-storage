import type { Fruit } from "../../../../../modules/fruit/domain/fruit";
import { getFruit } from "../../../../../modules/fruit/useCases/getFruit";
import type { GetFruitResponse } from "../../../../../modules/fruit/useCases/getFruit/getFruitResponse";
import type { Storage } from "../../../../../modules/storage/domain/storage";
import { storeStorage } from "../../../../../modules/storage/useCases/storeStorage";
import type { StoreStorageResponse } from "../../../../../modules/storage/useCases/storeStorage/storeStorageResponse";
import { parseReturn } from "../utils";

type StoreFruitToFruitStorageProps = {
	name: string;
	amount: number;
};

export const storeFruitToFruitStorageResolver = async (props: StoreFruitToFruitStorageProps) => {
	try {
		const fruit = await getFruit.execute({ name: props.name });
		if (fruit.isLeft()) {
			throw new Error(fruit.value.getErrorValue());
		}

		const fruitValue = (fruit as GetFruitResponse).value.getValue() as Fruit;

		const storage = await storeStorage.execute({
			fruidId: fruitValue.fruitId.getStringValue(),
			amount: props.amount,
		});
		if (storage.isLeft()) {
			throw new Error(storage.value.getErrorValue());
		}

		const storageValue = (storage as StoreStorageResponse).value.getValue() as Storage;

		return parseReturn(storageValue, fruitValue);
	} catch (error) {
		return error;
	}
};
