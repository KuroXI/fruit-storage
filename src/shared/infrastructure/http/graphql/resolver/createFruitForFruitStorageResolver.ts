import type { Fruit } from "../../../../../modules/fruit/domain/fruit";
import { createFruit } from "../../../../../modules/fruit/useCases/createFruit";
import type { CreateFruitResponse } from "../../../../../modules/fruit/useCases/createFruit/createFruitResponse";
import type { Storage } from "../../../../../modules/storage/domain/storage";
import { createStorage } from "../../../../../modules/storage/useCases/createStorage";
import type { CreateStorageResponse } from "../../../../../modules/storage/useCases/createStorage/createStorageResponse";
import { parseReturn } from "../utils";

type CreateFruitForFruitStorageProps = {
	name: string;
	description: string;
	limitOfFruitToBeStored: number;
};

export const createFruitForFruitStorageResolver = async (
	props: CreateFruitForFruitStorageProps,
) => {
	try {
		const fruit = await createFruit.execute({ name: props.name, description: props.description });
		if (fruit.isLeft()) {
			throw new Error(fruit.value.getErrorValue());
		}

		const fruitValue = (fruit as CreateFruitResponse).value.getValue() as Fruit;

		const storage = await createStorage.execute({
			fruitId: fruitValue.fruitId.getStringValue(),
			limitOfFruitToBeStored: props.limitOfFruitToBeStored,
		});
		if (storage.isLeft()) {
			throw new Error(storage.value.getErrorValue());
		}

		const storageValue = (storage as CreateStorageResponse).value.getValue() as Storage;

		return parseReturn(storageValue, fruitValue);
	} catch (error) {
		return error;
	}
};
