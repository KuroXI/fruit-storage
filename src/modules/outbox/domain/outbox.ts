import { Guard, type IGuardArgument } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import type { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import type { OutboxCreatedAt } from "./outboxCreatedAt";
import type { OutboxEventName } from "./outboxEventName";
import { OutboxId } from "./outboxId";
import type { OutboxPayload } from "./outboxPayload";
import type { OutboxProcessed } from "./outboxProcessed";

interface OutboxProps {
	eventName: OutboxEventName;
	payload: OutboxPayload;
	processed: OutboxProcessed;
	createdAt: OutboxCreatedAt;
}

export class Outbox extends AggregateRoot<OutboxProps> {
	get outboxId(): OutboxId {
		return OutboxId.create(this._id).getValue();
	}

	get eventName(): OutboxEventName {
		return this.props.eventName;
	}

	get payload(): OutboxPayload {
		return this.props.payload;
	}

	get processed(): OutboxProcessed {
		return this.props.processed;
	}

	get createdAt(): OutboxCreatedAt {
		return this.props.createdAt;
	}

	private constructor(props: OutboxProps, id?: UniqueEntityID) {
		super(props, id);
	}

	public static create(props: OutboxProps, id?: UniqueEntityID): Result<Outbox> {
		const guardArgs: IGuardArgument[] = [
			{ argument: props.eventName, argumentName: "eventName" },
			{ argument: props.payload, argumentName: "payload" },
			{ argument: props.processed, argumentName: "processed" },
			{ argument: props.createdAt, argumentName: "createdAt" },
		];

		const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

		if (guardResult.isFailure) {
			return Result.fail<Outbox>(guardResult.getErrorValue());
		}

		return Result.ok<Outbox>(new Outbox(props, id));
	}
}
