import { Guard, type IGuardArgument } from "../../../core/Guard";
import { Result } from "../../../core/Result";
import { AggregateRoot } from "../../../domain/AggregateRoot";
import type { UniqueEntityID } from "../../../domain/UniqueEntityID";

interface OutboxProps {
	eventName: string;
	payload: string;
	processed: boolean;
	createdAt: Date;
}

export class OutboxPayload extends AggregateRoot<OutboxProps> {
	get id(): UniqueEntityID {
		return this._id;
	}

	get eventName(): string {
		return this.props.eventName;
	}

	get payload(): string {
		return this.props.payload;
	}

	get processed(): boolean {
		return this.props.processed;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	private constructor(props: OutboxProps, id?: UniqueEntityID) {
		super(props, id);
	}

	public static create(props: OutboxProps, id?: UniqueEntityID): Result<OutboxPayload> {
		const guardArgs: IGuardArgument[] = [
			{ argument: props.eventName, argumentName: "eventName" },
			{ argument: props.payload, argumentName: "payload" },
			{ argument: props.processed, argumentName: "processed" },
			{ argument: props.createdAt, argumentName: "createdAt" },
		];

		const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

		if (guardResult.isFailure) {
			return Result.fail(guardResult.getErrorValue());
		}

		return Result.ok(new OutboxPayload(props, id));
	}
}
