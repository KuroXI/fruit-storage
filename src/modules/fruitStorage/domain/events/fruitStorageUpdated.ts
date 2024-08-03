import type { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import type { IDomainEvent } from "../../../../shared/domain/events/IDomainEvents";
import type { FruitStorage } from "../fruitStorage";

export const FRUIT_STORAGE_UPDATE_EVENT_NAME = "FRUIT_STORAGE_UPDATE";

export class FruitStorageUpdated implements IDomainEvent<FruitStorage> {
	public readonly _eventName: string;
	public readonly _dateTimeOccurred: Date;
	public readonly _payload: FruitStorage;

	constructor(payload: FruitStorage) {
		this._eventName = FRUIT_STORAGE_UPDATE_EVENT_NAME;
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

	getPayload(): FruitStorage {
		return this._payload;
	}
}