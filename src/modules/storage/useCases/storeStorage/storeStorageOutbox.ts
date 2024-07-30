import { OutboxPayload } from "../../../../shared/infrastructure/kafka/outbox/outboxPayload";
import { outboxRepository } from "../../../../shared/infrastructure/kafka/outbox/repositories";
import { StorageUpdated } from "../../domain/events/storageUpdated";
import type { Storage } from "../../domain/storage";
import { StorageMapper } from "../../mappers/storageMapper";

export class StoreStorageOutbox {
	public static emit(storage: Storage) {
		const event = new StorageUpdated(storage);

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
