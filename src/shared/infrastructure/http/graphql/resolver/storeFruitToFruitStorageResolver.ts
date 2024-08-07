import { getFruitByNameController } from "../../../../../modules/fruit/useCases/getFruitByName";
import { storeAmountToFruitController } from "../../../../../modules/fruit/useCases/storeAmountToFruit";
import { getStorageByFruitIdController } from "../../../../../modules/storage/useCases/getStorageByFruitId";

type StoreFruitToFruitStorageProps = {
	name: string;
	amount: number;
};

export const storeFruitToFruitStorageResolver = async (props: StoreFruitToFruitStorageProps) => {
	try {
		const fruit = await getFruitByNameController.executeImpl({ name: props.name });
		const storage = await getStorageByFruitIdController.executeImpl({
			fruitId: fruit.fruitId.getStringValue(),
		});

		const updatedFruit = await storeAmountToFruitController.executeImpl({
			...props,
			limit: storage.limit.value,
		});

		return {
			id: storage.storageId.getStringValue(),
			limit: storage.limit.value,
			fruit: {
				id: updatedFruit.fruitId.getStringValue(),
				name: updatedFruit.name.value,
				description: updatedFruit.description.value,
				amount: updatedFruit.amount.value,
			},
		};
	} catch (error) {
		return error;
	}
};
