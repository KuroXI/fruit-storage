import type { IDomainEvent } from "../../../../shared/domain/events/IDomainEvents";
import type { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import type { Fruit } from "../fruit";

export const FRUIT_UPDATE_EVENT_NAME = "FRUIT_UPDATE";

export class FruitUpdated implements IDomainEvent<Fruit> {
	private readonly _eventName: string;
	private readonly _dateTimeOccurred: Date;
	private readonly _payload: Fruit;

	constructor(payload: Fruit) {
		this._eventName = FRUIT_UPDATE_EVENT_NAME;
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
