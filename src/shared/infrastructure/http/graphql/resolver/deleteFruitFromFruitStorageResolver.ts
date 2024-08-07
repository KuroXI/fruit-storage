import { deleteFruitByNameController } from "../../../../../modules/fruit/useCases/deleteFruitByName";
import { getStorageByFruitIdController } from "../../../../../modules/storage/useCases/getStorageByFruitId";

type DeleteFruitFromFruitStorageProps = {
	name: string;
	forceDelete: boolean;
};

export const deleteFruitFromFruitStorageResolver = async (
	props: DeleteFruitFromFruitStorageProps,
) => {
	try {
		const fruit = await deleteFruitByNameController.executeImpl(props);
		const storage = await getStorageByFruitIdController.executeImpl({
			fruitId: fruit.fruitId.getStringValue(),
		});

		return {
			id: storage.storageId.getStringValue(),
			limit: storage.limit.value,
			fruit: {
				id: fruit.fruitId.getStringValue(),
				name: fruit.name.value,
				description: fruit.description.value,
				amount: fruit.amount.value,
			},
		};
	} catch (error) {
		return error;
	}
};
