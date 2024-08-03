import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";

interface FruitNameProps {
	value: string;
}

export class FruitName extends ValueObject<FruitNameProps> {
	get value(): string {
		return this.props.value;
	}

	private constructor(props: FruitNameProps) {
		super(props);
	}

	public static create(props: FruitNameProps): Result<FruitName> {
		const guardResult = Guard.againstNullOrUndefined(props.value, "name");

		if (guardResult.isFailure) {
			return Result.fail<FruitName>(guardResult.getErrorValue());
		}

		return Result.ok<FruitName>(new FruitName(props));
	}
}
