import { Result } from "../../../shared/core/Result";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Fruit } from "../domain/fruit";
import { FruitAmount } from "../domain/fruitAmount";
import { FruitDescription } from "../domain/fruitDescription";
import { FruitName } from "../domain/fruitName";

interface IFruitFactoryProps {
	fruitId?: string | number;
	name: string;
	description: string;
	amount?: number;
}

export class FruitFactory {
	static create({ fruitId, name, description, amount }: IFruitFactoryProps): Result<Fruit> {
		const fruitNameOrError = FruitName.create({ value: name });
		const fruitDescriptionOrError = FruitDescription.create({ value: description });
		const fruitAmountOrError = FruitAmount.create({ value: amount ?? 0 });

		const fruitCombineResult = Result.combine([
			fruitNameOrError,
			fruitDescriptionOrError,
			fruitAmountOrError,
		]);
		if (fruitCombineResult.isFailure) {
			return Result.fail(fruitCombineResult.getErrorValue());
		}

		const fruitOrError = Fruit.create(
			{
				name: fruitNameOrError.getValue(),
				description: fruitDescriptionOrError.getValue(),
				amount: fruitAmountOrError.getValue(),
			},
			new UniqueEntityID(fruitId),
		);
		if (fruitOrError.isFailure) {
			return Result.fail(fruitOrError.getErrorValue().toString());
		}

		return Result.ok(fruitOrError.getValue());
	}
}
