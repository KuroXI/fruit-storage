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
		_id: new UniqueEntityID(),
		name: props.name,
		description: props.description,
		amount: props.amount
	});
	await fruit.save();

	const storage = await StorageModel.create({
		_id: new UniqueEntityID(),
		fruitId: fruit._id,
		limit: props.limit,
	});
	await storage.save();
};
