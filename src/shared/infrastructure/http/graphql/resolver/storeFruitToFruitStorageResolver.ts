import { getFruitByNameController } from "../../../../../modules/fruit/useCases/getFruitByName";
import { storeAmountToStorageController } from "../../../../../modules/storage/useCases/storeAmountToStorage";

type StoreFruitToFruitStorageProps = {
	name: string;
	amount: number;
};

export const storeFruitToFruitStorageResolver = async (props: StoreFruitToFruitStorageProps) => {
	try {
		const fruit = await getFruitByNameController.executeImpl(props);
		const storage = await storeAmountToStorageController.executeImpl({
			fruidId: fruit.fruitId.getStringValue(),
			amount: props.amount,
		});

		return {
			id: storage.storageId.getStringValue(),
			limit: storage.limit.value,
			amount: storage.amount.value,
			fruit: {
				id: fruit.fruitId.getStringValue(),
				name: fruit.name.value,
				description: fruit.description.value,
			},
		};
	} catch (error) {
		return error;
	}
};
