import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";

interface OutboxEventNameProps {
	value: string;
}

export class OutboxEventName extends ValueObject<OutboxEventNameProps> {
	get value(): string {
		return this.props.value;
	}

	private constructor(props: OutboxEventNameProps) {
		super(props);
	}

	public static create(props: OutboxEventNameProps): Result<OutboxEventName> {
		const guardResult = Guard.againstNullOrUndefined(props.value, "eventName");

		if (guardResult.isFailure) {
			return Result.fail<OutboxEventName>(guardResult.getErrorValue());
		}

		return Result.ok<OutboxEventName>(new OutboxEventName(props));
	}
}
