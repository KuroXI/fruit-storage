import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";

interface StorageLimitProps {
	value: number;
}

export class StorageLimit extends ValueObject<StorageLimitProps> {
	getStringValue(): string {
		return String(this.props.value);
	}

	get value(): number {
		return this.props.value;
	}

	private constructor(props: StorageLimitProps) {
		super(props);
	}

	public static create(props: StorageLimitProps): Result<StorageLimit> {
		const guardResult = Guard.againstNullOrUndefined(props.value, "limit");

		if (guardResult.isFailure) {
			return Result.fail<StorageLimit>(guardResult.getErrorValue());
		}

		return Result.ok<StorageLimit>(new StorageLimit(props));
	}
}
