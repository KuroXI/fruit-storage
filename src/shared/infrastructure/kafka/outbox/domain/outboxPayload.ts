import { Guard } from "../../../../core/Guard";
import { Result } from "../../../../core/Result";
import { ValueObject } from "../../../../domain/ValueObject";

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
