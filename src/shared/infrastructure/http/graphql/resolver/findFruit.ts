import type { Fruit } from "../../../../../modules/fruit/domain/fruit";
import { getFruit } from "../../../../../modules/fruit/useCases/getFruit";
import type { GetFruitResponse } from "../../../../../modules/fruit/useCases/getFruit/getFruitResponse";
import type { Storage } from "../../../../../modules/storage/domain/storage";
import { getStorage } from "../../../../../modules/storage/useCases/getStorage";
import type { GetStorageResponse } from "../../../../../modules/storage/useCases/getStorage/getStorageResponse";
import { parseReturn } from "../utils";

interface IFindFruitResolverProps {
	name: string;
}

export const findFruitResolver = async ({ name }: IFindFruitResolverProps) => {
	try {
		const fruit = await getFruit.execute({ name });
		if (fruit.isLeft()) {
			throw new Error(fruit.value.getErrorValue());
		}

		const fruitValue = (fruit as GetFruitResponse).value.getValue() as Fruit;

		const storage = await getStorage.execute({ fruitId: fruitValue.fruitId.getStringValue() });
		if (storage.isLeft()) {
			throw new Error(storage.value.getErrorValue());
		}

		const storageValue = (storage as GetStorageResponse).value.getValue() as Storage;

		return parseReturn(storageValue, fruitValue);
	} catch (error) {
		return error;
	}
};
