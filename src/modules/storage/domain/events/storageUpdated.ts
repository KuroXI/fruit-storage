import type { IDomainEvent } from "../../../../shared/domain/events/IDomainEvents";
import type { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import type { Storage } from "../storage";

export const FRUIT_STORAGE_UPDATE_EVENT_NAME = "FRUIT_STORAGE_UPDATE";

export class StorageUpdated implements IDomainEvent<Storage> {
	public readonly _eventName: string;
	public readonly _dateTimeOccurred: Date;
	public readonly _payload: Storage;

	constructor(payload: Storage) {
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

	getPayload(): Storage {
		return this._payload;
	}
}
