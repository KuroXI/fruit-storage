import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";

interface FruitDescriptionProps {
	value: string;
}

export class FruitDescription extends ValueObject<FruitDescriptionProps> {
	public static readonly maxLength: number = 30;

	get value(): string {
		return this.props.value;
	}

	private constructor(props: FruitDescriptionProps) {
		super(props);
	}

	public static create(props: FruitDescriptionProps): Result<FruitDescription> {
		const guardResult = Guard.againstNullOrUndefined(props.value, "description");

		if (guardResult.isFailure) {
			return Result.fail<FruitDescription>(guardResult.getErrorValue());
		}

		const maxGuardResult = Guard.againstAtMost(FruitDescription.maxLength, props.value);

		if (maxGuardResult.isFailure) {
			return Result.fail<FruitDescription>(maxGuardResult.getErrorValue());
		}

		return Result.ok<FruitDescription>(new FruitDescription(props));
	}
}
