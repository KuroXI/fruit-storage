import type { Outbox } from "../domain/outbox";

export interface IOutboxRepo {
	save(outbox: Outbox): Promise<void>;
	getPendings(): Promise<Outbox[]>;
	markAsProcessed(outbox: Outbox): Promise<void>;
}
