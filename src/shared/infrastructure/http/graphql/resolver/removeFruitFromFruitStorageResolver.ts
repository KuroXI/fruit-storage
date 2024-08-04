import { removeAmountFromFruitStorageController } from "../../../../../modules/fruitStorage/useCases/removeAmountFromFruitStorage";
import { parseReturn } from "../utils";

type RemoveFruitFromFruitStorageProps = {
	name: string;
	amount: number;
};

export const removeFruitFromFruitStorageResolver = async (
	props: RemoveFruitFromFruitStorageProps,
) => {
	try {
		const fruitStorageController = await removeAmountFromFruitStorageController.executeImpl(props);
		return parseReturn(fruitStorageController);
	} catch (error) {
		return error;
	}
};
