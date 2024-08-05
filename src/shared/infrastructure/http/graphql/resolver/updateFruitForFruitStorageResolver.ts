import { updatedFruitController } from "../../../../../modules/fruit/useCases/updateFruit";
import { updateStorageByFruitIdController } from "../../../../../modules/storage/useCases/updateStorageByFruitId";

type UpdateFruitForFruitStorageProps = {
	name: string;
	description: string;
	limitOfFruitToBeStored: number;
};

export const updateFruitForFruitStorageResolver = async (
	props: UpdateFruitForFruitStorageProps,
) => {
	try {
		const fruit = await updatedFruitController.executeImpl(props);
		const storage = await updateStorageByFruitIdController.executeImpl({
			fruidId: fruit.fruitId.getStringValue(),
			limit: props.limitOfFruitToBeStored,
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
