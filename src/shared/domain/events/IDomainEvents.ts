import type { UniqueEntityID } from "../UniqueEntityID";

export interface IDomainEvent<T> {
	getEventName(): string;
	getAggregateId(): UniqueEntityID;
	getDateTimeOccurred(): Date;
	getPayload(): T;
}
