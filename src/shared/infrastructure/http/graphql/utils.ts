import type { FruitStorage } from "../../../../modules/fruitStorage/domain/fruitStorage";

export const parseReturn = (fruitStorage: FruitStorage) => {
	return {
		id: fruitStorage.storageId.getStringValue(),
		limit: fruitStorage.limit.value,
		amount: fruitStorage.amount.value,
		fruit: {
			id: fruitStorage.fruit.fruitId.getStringValue(),
			name: fruitStorage.fruit.name.value,
			description: fruitStorage.fruit.description.value,
		},
	};
};
