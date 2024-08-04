import { storeAmountToFruitStorageController } from "../../../../../modules/fruitStorage/useCases/storeAmountToFruitStorage";
import { parseReturn } from "../utils";

type StoreFruitToFruitStorageProps = {
	name: string;
	amount: number;
};

export const storeFruitToFruitStorageResolver = async (props: StoreFruitToFruitStorageProps) => {
	try {
		const fruitStorageController = await storeAmountToFruitStorageController.executeImpl(props);
		return parseReturn(fruitStorageController);
	} catch (error) {
		return error;
	}
};
