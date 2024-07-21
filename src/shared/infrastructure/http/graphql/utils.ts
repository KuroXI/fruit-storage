import type { Fruit } from "../../../../modules/fruit/domain/fruit";
import type { Storage } from "../../../../modules/storage/domain/storage";

export const parseReturn = (storage: Storage, fruit: Fruit) => {
	return {
		id: storage.storageId.getStringValue(),
		limit: storage.limit.value,
		amount: storage.amount.value,
		fruit: {
			id: fruit.fruitId.getStringValue(),
			name: fruit.name.value,
			description: fruit.description.value,
		},
	};
};
