import { updateFruitStorageController } from "../../../../../modules/fruitStorage/useCases/updateFruitStorage";
import { parseReturn } from "../utils";

type UpdateFruitForFruitStorageProps = {
	name: string;
	description: string;
	limitOfFruitToBeStored: number;
};

export const updateFruitForFruitStorageResolver = async (
	props: UpdateFruitForFruitStorageProps,
) => {
	try {
		const fruitStorageController = await updateFruitStorageController.executeImpl(props);
		return parseReturn(fruitStorageController);
	} catch (error) {
		return error;
	}
};
