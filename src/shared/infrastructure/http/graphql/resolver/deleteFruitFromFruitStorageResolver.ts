import { deleteFruitStorageByNameController } from "../../../../../modules/fruitStorage/useCases/deleteFruitStorageByName";
import { parseReturn } from "../utils";

type DeleteFruitFromFruitStorageProps = {
	name: string;
	forceDelete: boolean;
};

export const deleteFruitFromFruitStorageResolver = async (
	props: DeleteFruitFromFruitStorageProps,
) => {
	try {
		const fruitStorageController = await deleteFruitStorageByNameController.executeImpl(props);
		return parseReturn(fruitStorageController);
	} catch (error) {
		return error;
	}
};
