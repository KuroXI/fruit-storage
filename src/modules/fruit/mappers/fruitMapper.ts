import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Fruit } from "../domain/fruit";
import { FruitAmount } from "../domain/fruitAmount";
import { FruitDescription } from "../domain/fruitDescription";
import { FruitName } from "../domain/fruitName";

export class FruitMapper {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public static toDomain(raw: any): Fruit {
		const fruitOrError = Fruit.create(
			{
				name: FruitName.create({ value: raw.name }).getValue(),
				description: FruitDescription.create({
					value: raw.description,
				}).getValue(),
				amount: FruitAmount.create({ value: raw.amount }).getValue(),
			},
			new UniqueEntityID(raw._id),
		);

		if (fruitOrError.isFailure) {
			console.log(fruitOrError.getErrorValue());
		}

		return fruitOrError.getValue();
	}

	public static toPersistence(fruit: Fruit) {
		return {
			_id: fruit.id,
			name: fruit.name.value,
			description: fruit.description.value,
			amount: fruit.amount.value,
		};
	}
}
