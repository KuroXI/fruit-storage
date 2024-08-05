import { deleteFruitByNameController } from "../../../../../modules/fruit/useCases/deleteFruitByName";
import { deleteStorageByFruitIdController } from "../../../../../modules/storage/useCases/deleteStorageByFruitId";

type DeleteFruitFromFruitStorageProps = {
	name: string;
	forceDelete: boolean;
};

export const deleteFruitFromFruitStorageResolver = async (
	props: DeleteFruitFromFruitStorageProps,
) => {
	try {
		const fruit = await deleteFruitByNameController.executeImpl({ name: props.name });
		const storage = await deleteStorageByFruitIdController.executeImpl({
			fruidId: fruit.fruitId.getStringValue(),
			forceDelete: props.forceDelete,
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
