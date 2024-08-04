import { UniqueEntityID } from "../../src/shared/domain/UniqueEntityID";
import { FruitModel } from "../../src/shared/infrastructure/database/mongoose/models/Fruit";
import { StorageModel } from "../../src/shared/infrastructure/database/mongoose/models/Storage";

type SeedFruitForFruitStorageProps = {
	name: string;
	description: string;
	limit: number;
	amount: number;
};

export const seedFruitForFruitStorage = async (props: SeedFruitForFruitStorageProps) => {
	const fruit = await FruitModel.create({
		id: new UniqueEntityID(),
		name: props.name,
		description: props.description,
	});
	await fruit.save();

	const storage = await StorageModel.create({
		id: new UniqueEntityID(),
		fruitId: fruit.id,
		limit: props.limit,
		amount: props.amount,
	});
	await storage.save();
};
