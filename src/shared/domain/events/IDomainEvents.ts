export interface IDomainEvent {
	getPayloadToJSON(): object;
}
