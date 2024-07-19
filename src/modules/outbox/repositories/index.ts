import type { Outbox } from "../domain/outbox";

export interface IOutboxRepository {
	save(outbox: Outbox): Promise<void>;
	getPendings(): Promise<Outbox[]>;
	markAsProcessed(outbox: Outbox): Promise<void>;
}
