import type { IDomainEvent } from "../../../../shared/domain/events/IDomainEvents";
import type { Fruit } from "../fruit";

export class FruitDomainEvent implements IDomainEvent {
	private readonly _eventName: string;
	private readonly _dateTimeOccurred: Date;
	private readonly _payload: Fruit;

	constructor(eventName: string, payload: Fruit) {
		this._eventName = eventName;
		this._dateTimeOccurred = new Date();
		this._payload = payload;
	}

	get eventName(): string {
		return this._eventName;
	}

	get dateTimeOccurred(): Date {
		return this._dateTimeOccurred;
	}

	get payload(): Fruit {
		return this._payload;
	}

	getPayloadToJSON(): object {
		return {
			id: this.payload.fruitId.getStringValue(),
			name: this.payload.name.value,
			description: this.payload.description.value,
			amount: this.payload.amount.value,
		};
	}
}
