import type { OutboxPayload } from "../outboxPayload";

export interface IOutboxRepository {
	sendPayload(outbox: OutboxPayload): Promise<void>;
	getPendings(): Promise<OutboxPayload[]>;
	markAsProcessed(id: string | number): Promise<void>;
}
