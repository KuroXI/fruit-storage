import { createFruitController } from "../../../../../modules/fruit/useCases/createFruit";

type CreateFruitForFruitStorageProps = {
	name: string;
	description: string;
	limitOfFruitToBeStored: number;
};

export const createFruitForFruitStorageResolver = async (
	props: CreateFruitForFruitStorageProps,
) => {
	try {
		const fruit = await createFruitController.executeImpl(props);

		return {
			id: fruit.fruitId.getStringValue(),
			name: fruit.name.value,
			description: fruit.description.value,
			amount: fruit.amount.value,
		};
	} catch (error) {
		return error;
	}
};
