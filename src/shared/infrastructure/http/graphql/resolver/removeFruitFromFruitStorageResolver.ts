import type { Fruit } from "../../../../../modules/fruit/domain/fruit";
import { getFruit } from "../../../../../modules/fruit/useCases/getFruit";
import type { GetFruitResponse } from "../../../../../modules/fruit/useCases/getFruit/getFruitResponse";
import type { Storage } from "../../../../../modules/storage/domain/storage";
import { removeStorage } from "../../../../../modules/storage/useCases/removeStorage";
import type { RemoveStorageResponse } from "../../../../../modules/storage/useCases/removeStorage/removeStorageResponse";
import { parseReturn } from "../utils";

type RemoveFruitFromFruitStorageProps = {
	name: string;
	amount: number;
};

export const removeFruitFromFruitStorageResolver = async (
	props: RemoveFruitFromFruitStorageProps,
) => {
	try {
		const fruit = await getFruit.execute({ name: props.name });
		if (fruit.isLeft()) {
			throw new Error(fruit.value.getErrorValue());
		}

		const fruitValue = (fruit as GetFruitResponse).value.getValue() as Fruit;

		const storage = await removeStorage.execute({
			fruidId: fruitValue.fruitId.getStringValue(),
			amount: props.amount,
		});
		if (storage.isLeft()) {
			throw new Error(storage.value.getErrorValue());
		}

		const storageValue = (storage as RemoveStorageResponse).value.getValue() as Storage;

		return parseReturn(storageValue, fruitValue);
	} catch (error) {
		return error;
	}
};
