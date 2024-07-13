import { FruitModel } from "./Fruit";
import { FruitStorageModel } from "./FruitStorage";
import { OutboxModel } from "./Outbox";

export type MongooseModels = {
	fruit: typeof FruitModel;
	fruitStorage: typeof FruitStorageModel;
	outbox: typeof OutboxModel;
};

export const models: MongooseModels = {
	fruit: FruitModel,
	fruitStorage: FruitStorageModel,
	outbox: OutboxModel,
};
