import { findFruitStorageByNameController } from "../../../../../modules/fruitStorage/useCases/findFruitStorageByName";
import { parseReturn } from "../utils";

interface IFindFruitResolverProps {
	name: string;
}

export const findFruitResolver = async (props: IFindFruitResolverProps) => {
	try {
		const fruitStorageController = await findFruitStorageByNameController.executeImpl(props);
		return parseReturn(fruitStorageController);
	} catch (error) {
		return error;
	}
};
