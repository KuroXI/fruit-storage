import { createFruitStorageController } from "../../../../../modules/fruitStorage/useCases/createFruitStorage";
import { parseReturn } from "../utils";

type CreateFruitForFruitStorageProps = {
	name: string;
	description: string;
	limitOfFruitToBeStored: number;
};

export const createFruitForFruitStorageResolver = async (
	props: CreateFruitForFruitStorageProps,
) => {
	try {
		const fruitStorageController = await createFruitStorageController.executeImpl(props);
		return parseReturn(fruitStorageController);
	} catch (error) {
		return error;
	}
};
