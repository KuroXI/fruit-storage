import "jest";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Fruit } from "./fruit";
import { FruitDescription } from "./fruitDescription";
import { FruitId } from "./fruitId";
import { FruitName } from "./fruitName";

test("should be able to create a fruit", () => {
	const fruitIdOrError = FruitId.create(new UniqueEntityID());
	expect(fruitIdOrError.isSuccess).toBe(true);

	const fruitNameOrError = FruitName.create({ value: "lemon" });
	expect(fruitNameOrError.isSuccess).toBe(true);

	const fruitDescriptionOrError = FruitDescription.create({ value: "this is a lemon" });
	expect(fruitDescriptionOrError.isSuccess).toBe(true);

	const fruitOrError = Fruit.create(
		{
			name: fruitNameOrError.getValue(),
			description: fruitDescriptionOrError.getValue(),
		},
		fruitIdOrError.getValue().getValue(),
	);
	expect(fruitOrError.isSuccess).toBe(true);
});

test("should not be able to create a fruit due to long description", () => {
	const fruitDescriptionOrError = FruitDescription.create({
		value: "this is a fruit with a very long description",
	});
	expect(fruitDescriptionOrError.isSuccess).toBe(false);
});
