import { Result } from "../../../shared/core/Result";
import { Fruit } from "../domain/fruit";
import type { FruitDescription } from "../domain/fruitDescription";
import type { FruitId } from "../domain/fruitId";
import type { FruitName } from "../domain/fruitName";

export interface IFruitFactoryCreateProps {
	fruitId: FruitId;
	name: FruitName;
	description: FruitDescription;
}

export class FruitFactory {
	static create(props: IFruitFactoryCreateProps): Result<Fruit> {
		const fruitOrError = Fruit.create(
			{ name: props.name, description: props.description },
			props.fruitId.getValue(),
		);
		if (fruitOrError.isFailure) {
			return Result.fail(fruitOrError.getErrorValue().toString());
		}

		return Result.ok(fruitOrError.getValue());
	}
}
