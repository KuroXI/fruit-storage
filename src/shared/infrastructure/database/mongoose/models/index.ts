import { FruitModel } from "./Fruit";
import { OutboxModel } from "./Outbox";
import { StorageModel } from "./Storage";

export type MongooseModels = {
	fruit: typeof FruitModel;
	storage: typeof StorageModel;
	outbox: typeof OutboxModel;
};

export const models: MongooseModels = {
	fruit: FruitModel,
	storage: StorageModel,
	outbox: OutboxModel,
};
