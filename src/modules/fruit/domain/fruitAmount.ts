import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";

interface FruitAmountProps {
	value: number;
}

export class FruitAmount extends ValueObject<FruitAmountProps> {
	getStringValue(): string {
		return String(this.props.value);
	}

	get value(): number {
		return this.props.value;
	}

	private constructor(props: FruitAmountProps) {
		super(props);
	}

	public static create(props: FruitAmountProps): Result<FruitAmount> {
		const guardResult = Guard.againstNullOrUndefined(props.value, "amount");

		if (guardResult.isFailure) {
			return Result.fail<FruitAmount>(guardResult.getErrorValue());
		}

		return Result.ok<FruitAmount>(new FruitAmount(props));
	}
}
