import { Outbox } from "../../../../shared/infrastructure/kafka/outbox/domain/outbox";
import { OutboxCreatedAt } from "../../../../shared/infrastructure/kafka/outbox/domain/outboxCreatedAt";
import { OutboxEventName } from "../../../../shared/infrastructure/kafka/outbox/domain/outboxEventName";
import { OutboxPayload } from "../../../../shared/infrastructure/kafka/outbox/domain/outboxPayload";
import { OutboxProcessed } from "../../../../shared/infrastructure/kafka/outbox/domain/outboxProcessed";
import { outboxRepository } from "../../../../shared/infrastructure/kafka/outbox/repositories/implementations";
import { StorageUpdated } from "../../domain/events/storageUpdated";
import type { Storage } from "../../domain/storage";

export class StoreStorageOutbox {
	public static emit(storage: Storage) {
		const event = new StorageUpdated(storage);

		outboxRepository.save(
			Outbox.create({
				eventName: OutboxEventName.create({
					value: event.getEventName(),
				}).getValue(),
				createdAt: OutboxCreatedAt.create({
					value: event.getDateTimeOccurred(),
				}).getValue(),
				processed: OutboxProcessed.create({ value: false }).getValue(),
				payload: OutboxPayload.create({
					value: JSON.stringify(event.getPayload()),
				}).getValue(),
			}).getValue(),
		);
	}
}
