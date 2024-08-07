import { removeAmountFromFruitController } from "../../../../../modules/fruit/useCases/removeAmountFromFruit";
import { getStorageByFruitIdController } from "../../../../../modules/storage/useCases/getStorageByFruitId";

type RemoveFruitFromFruitStorageProps = {
	name: string;
	amount: number;
};

export const removeFruitFromFruitStorageResolver = async (
	props: RemoveFruitFromFruitStorageProps,
) => {
	try {
		const fruit = await removeAmountFromFruitController.executeImpl(props);
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
