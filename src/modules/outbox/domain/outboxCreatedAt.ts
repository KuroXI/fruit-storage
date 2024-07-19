import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";

interface OutboxCreatedAtProps {
	value: Date;
}

export class OutboxCreatedAt extends ValueObject<OutboxCreatedAtProps> {
	get value(): Date {
		return this.props.value;
	}

	private constructor(props: OutboxCreatedAtProps) {
		super(props);
	}

	public static create(props: OutboxCreatedAtProps): Result<OutboxCreatedAt> {
		const guardResult = Guard.againstNullOrUndefined(props.value, "createdAt");

		if (guardResult.isFailure) {
			return Result.fail<OutboxCreatedAt>(guardResult.getErrorValue());
		}

		return Result.ok<OutboxCreatedAt>(new OutboxCreatedAt(props));
	}
}