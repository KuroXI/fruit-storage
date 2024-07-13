import { Guard, type IGuardArgument } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import type { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import type { FruitDescription } from "./fruitDescription";
import { FruitId } from "./fruitId";
import type { FruitName } from "./fruitName";

export interface FruitProps {
	name: FruitName;
	description: FruitDescription;
}

export class Fruit extends AggregateRoot<FruitProps> {
	get fruitId(): FruitId {
		return FruitId.create(this._id).getValue();
	}

	get name(): FruitName {
		return this.props.name;
	}

	get description(): FruitDescription {
		return this.props.description;
	}

	private constructor(props: FruitProps, id?: UniqueEntityID) {
		super(props, id);
	}

	public static create(props: FruitProps, id?: UniqueEntityID): Result<Fruit> {
		const guardArgs: IGuardArgument[] = [
			{ argument: props.name, argumentName: "name" },
			{ argument: props.description, argumentName: "description" },
		];

		const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

		if (guardResult.isFailure) {
			return Result.fail<Fruit>(guardResult.getErrorValue());
		}

		return Result.ok<Fruit>(new Fruit(props, id));
	}
}
