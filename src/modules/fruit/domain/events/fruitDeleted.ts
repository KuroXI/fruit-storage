import type { IDomainEvent } from "../../../../shared/domain/events/IDomainEvents";
import type { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import type { Fruit } from "../fruit";

export const FRUIT_DELETE_EVENT_NAME = "FRUIT_DELETE";

export class FruitDeleted implements IDomainEvent<Fruit> {
	public readonly _eventName: string;
	public readonly _dateTimeOccurred: Date;
	public readonly _payload: Fruit;

	constructor(payload: Fruit) {
		this._eventName = FRUIT_DELETE_EVENT_NAME;
		this._dateTimeOccurred = new Date();
		this._payload = payload;
	}

	getEventName(): string {
		return this._eventName;
	}

	getAggregateId(): UniqueEntityID {
		return this._payload.id;
	}

	getDateTimeOccurred(): Date {
		return this._dateTimeOccurred;
	}

	getPayload(): Fruit {
		return this._payload;
	}
}
