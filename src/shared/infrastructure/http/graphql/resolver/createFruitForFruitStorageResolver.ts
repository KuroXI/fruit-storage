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
			id: fruit.id.toString(),
			name: fruit.name.value,
			description: fruit.description.value,
		};
	} catch (error) {
		return error;
	}
};
