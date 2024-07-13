import { Entity } from "./Entity";
import type { UniqueEntityID } from "./UniqueEntityID";

export abstract class AggregateRoot<T> extends Entity<T> {
	get id(): UniqueEntityID {
		return this._id;
	}
}
