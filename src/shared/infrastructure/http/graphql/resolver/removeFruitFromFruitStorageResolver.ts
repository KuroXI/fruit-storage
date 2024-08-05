import { getFruitByNameController } from "../../../../../modules/fruit/useCases/getFruitByName";
import { removeAmountFromStorageController } from "../../../../../modules/storage/useCases/removeAmountFromStorage";

type RemoveFruitFromFruitStorageProps = {
	name: string;
	amount: number;
};

export const removeFruitFromFruitStorageResolver = async (
	props: RemoveFruitFromFruitStorageProps,
) => {
	try {
		const fruit = await getFruitByNameController.executeImpl(props);
		const storage = await removeAmountFromStorageController.executeImpl({
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
