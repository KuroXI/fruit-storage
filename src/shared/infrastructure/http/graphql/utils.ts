import type { FlattenMaps, Types } from "mongoose";
import type { IFruitStorage } from "../../database/mongoose/models/FruitStorage";
import type { IFruit } from "../../database/mongoose/models/Fruit";
import type { Storage } from "../../../../modules/storage/domain/storage";
import type { Fruit } from "../../../../modules/fruit/domain/fruit";

export const toReturnQuery = (
	storage: FlattenMaps<IFruitStorage> & {
		_id: Types.ObjectId;
	},
	fruit: FlattenMaps<IFruit> & {
		_id: Types.ObjectId;
	},
) => {
	return {
		id: storage._id,
		limit: storage.limit,
		amount: storage.amount,
		fruit: {
			id: fruit._id,
			name: fruit.name,
			description: fruit.description,
		},
	};
};

export const parseReturn = (storage: Storage, fruit: Fruit) => {
	return {
		id: storage.storageId.getStringValue(),
		limit: storage.limit.getStringValue(),
		amount: storage.amount.getStringValue(),
		fruit: {
			id: fruit.fruitId.getStringValue(),
			name: fruit.name.value,
			description: fruit.description.value,
		},
	};
};
