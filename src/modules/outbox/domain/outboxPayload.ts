import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";

interface OutboxPayloadProps {
	value: string;
}

export class OutboxPayload extends ValueObject<OutboxPayloadProps> {
	get value(): string {
		return this.props.value;
	}

	private constructor(props: OutboxPayloadProps) {
		super(props);
	}

	public static create(props: OutboxPayloadProps): Result<OutboxPayload> {
		const guardResult = Guard.againstNullOrUndefined(props.value, "payload");

		if (guardResult.isFailure) {
			return Result.fail<OutboxPayload>(guardResult.getErrorValue());
		}

		return Result.ok<OutboxPayload>(new OutboxPayload(props));
	}
}
