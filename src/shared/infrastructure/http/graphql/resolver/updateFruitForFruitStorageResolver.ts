import type { Fruit } from "../../../../../modules/fruit/domain/fruit";
import { updateFruit } from "../../../../../modules/fruit/useCases/updateFruit";
import type { UpdateFruitResponse } from "../../../../../modules/fruit/useCases/updateFruit/updateFruitResponse";
import type { Storage } from "../../../../../modules/storage/domain/storage";
import { updateStorage } from "../../../../../modules/storage/useCases/updateStorage";
import type { UpdateStorageResponse } from "../../../../../modules/storage/useCases/updateStorage/updateStorageResponse";
import { parseReturn } from "../utils";

type UpdateFruitForFruitStorageProps = {
	name: string;
	description: string;
	limitOfFruitToBeStored: number;
};

export const updateFruitForFruitStorageResolver = async (
	props: UpdateFruitForFruitStorageProps,
) => {
	try {
		const fruit = await updateFruit.execute({ name: props.name, description: props.description });
		if (fruit.isLeft()) {
			throw new Error(fruit.value.getErrorValue());
		}

		const fruitValue = (fruit as UpdateFruitResponse).value.getValue() as Fruit;

		const storage = await updateStorage.execute({
			fruidId: fruitValue.fruitId.getStringValue(),
			limit: props.limitOfFruitToBeStored,
		});
		if (storage.isLeft()) {
			throw new Error(storage.value.getErrorValue());
		}

		const storageValue = (storage as UpdateStorageResponse).value.getValue() as Storage;

		return parseReturn(storageValue, fruitValue);
	} catch (error) {
		return error;
	}
};
