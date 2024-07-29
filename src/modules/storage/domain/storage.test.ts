import "jest";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Storage } from "./storage";
import { StorageAmount } from "./storageAmount";
import { StorageFruitId } from "./storageFruitId";
import { StorageId } from "./storageId";
import { StorageLimit } from "./storageLimit";

test("should be able to create a storage", () => {
	const storageIdOrError = StorageId.create(new UniqueEntityID());
	expect(storageIdOrError.isSuccess).toBe(true);

	const storageFruitIdOrError = StorageFruitId.create({ value: new UniqueEntityID().toString() });
	expect(storageFruitIdOrError.isSuccess).toBe(true);

	const storageAmountOrError = StorageAmount.create({ value: 0 });
	expect(storageAmountOrError.isSuccess).toBe(true);

	const storageLimitOrError = StorageLimit.create({ value: 5 });
	expect(storageLimitOrError.isSuccess).toBe(true);

	const storageOrError = Storage.create(
		{
			fruitId: storageFruitIdOrError.getValue(),
			amount: storageAmountOrError.getValue(),
			limit: storageLimitOrError.getValue(),
		},
		storageIdOrError.getValue().getValue(),
	);
	expect(storageOrError.isSuccess).toBe(true);
});
