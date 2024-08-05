import { getFruitByNameController } from "../../../../../modules/fruit/useCases/getFruitByName";
import { getStorageByFruitIdController } from "../../../../../modules/storage/useCases/getStorageByFruitId";

interface IFindFruitResolverProps {
	name: string;
}

export const findFruitResolver = async (props: IFindFruitResolverProps) => {
	try {
		const fruit = await getFruitByNameController.executeImpl(props);
		const storage = await getStorageByFruitIdController.executeImpl({
			fruitId: fruit.fruitId.getStringValue(),
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
