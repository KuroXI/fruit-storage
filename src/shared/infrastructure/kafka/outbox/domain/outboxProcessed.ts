import { Guard } from "../../../../core/Guard";
import { Result } from "../../../../core/Result";
import { ValueObject } from "../../../../domain/ValueObject";

interface OutboxProcessedProps {
	value: boolean;
}

export class OutboxProcessed extends ValueObject<OutboxProcessedProps> {
	get value(): boolean {
		return this.props.value;
	}

	private constructor(props: OutboxProcessedProps) {
		super(props);
	}

	public static create(props: OutboxProcessedProps): Result<OutboxProcessed> {
		const guardResult = Guard.againstNullOrUndefined(props.value, "processed");

		if (guardResult.isFailure) {
			return Result.fail<OutboxProcessed>(guardResult.getErrorValue());
		}

		return Result.ok<OutboxProcessed>(new OutboxProcessed(props));
	}
}
