import { OutboxPayload } from "../../../../shared/infrastructure/kafka/outbox/outboxPayload";
import { outboxRepository } from "../../../../shared/infrastructure/kafka/outbox/repositories";
import { StorageDeleted } from "../../domain/events/storageDeleted";
import type { Storage } from "../../domain/storage";
import { StorageMapper } from "../../mappers/storageMapper";

export class DeleteStorageOutbox {
	public static emit(storage: Storage) {
		const event = new StorageDeleted(storage);

		const outboxPayloadOrError = OutboxPayload.create(
			{
				eventName: event.getEventName(),
				payload: JSON.stringify(StorageMapper.toPersistence(event.getPayload())),
				processed: false,
				createdAt: event.getDateTimeOccurred(),
			},
			event.getAggregateId(),
		);
		if (outboxPayloadOrError.isFailure) throw new Error();

		outboxRepository.sendPayload(outboxPayloadOrError.getValue());
	}
}
