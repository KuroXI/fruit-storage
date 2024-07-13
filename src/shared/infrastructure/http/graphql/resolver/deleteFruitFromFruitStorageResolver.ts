import type { Fruit } from "../../../../../modules/fruit/domain/fruit";
import { deleteFruit } from "../../../../../modules/fruit/useCases/deleteFruit";
import type { DeleteFruitResponse } from "../../../../../modules/fruit/useCases/deleteFruit/deleteFruitResponse";
import type { Storage } from "../../../../../modules/storage/domain/storage";
import { deleteStorage } from "../../../../../modules/storage/useCases/deleteStorage";
import type { DeleteStorageResponse } from "../../../../../modules/storage/useCases/deleteStorage/deleteStorageResponse";
import { parseReturn } from "../utils";

type DeleteFruitFromFruitStorageProps = {
	name: string;
	forceDelete: boolean;
};

export const deleteFruitFromFruitStorageResolver = async (
	props: DeleteFruitFromFruitStorageProps,
) => {
	try {
		const fruit = await deleteFruit.execute({ name: props.name });
		if (fruit.isLeft()) {
			throw new Error(fruit.value.getErrorValue());
		}

		const fruitValue = (fruit as DeleteFruitResponse).value.getValue() as Fruit;

		const fruitStorage = await deleteStorage.execute({
			fruidId: fruitValue.fruitId.getStringValue(),
			forceDelete: props.forceDelete,
		});
		if (fruitStorage.isLeft()) {
			throw new Error(fruitStorage.value.getErrorValue());
		}

		const fruitStorageValue = (fruitStorage as DeleteStorageResponse).value.getValue() as Storage;

		return parseReturn(fruitStorageValue, fruitValue);
	} catch (error) {
		return error;
	}
};
