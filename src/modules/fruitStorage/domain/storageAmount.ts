import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";

interface StorageAmountProps {
	value: number;
}

export class StorageAmount extends ValueObject<StorageAmountProps> {
	getStringValue(): string {
		return String(this.props.value);
	}

	get value(): number {
		return this.props.value;
	}

	private constructor(props: StorageAmountProps) {
		super(props);
	}

	public static create(props: StorageAmountProps): Result<StorageAmount> {
		const guardResult = Guard.againstNullOrUndefined(props.value, "amount");

		if (guardResult.isFailure) {
			return Result.fail<StorageAmount>(guardResult.getErrorValue());
		}

		return Result.ok<StorageAmount>(new StorageAmount(props));
	}
}
