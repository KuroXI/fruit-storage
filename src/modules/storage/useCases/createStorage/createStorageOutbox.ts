import { OutboxPayload } from "../../../../shared/infrastructure/kafka/outbox/outboxPayload";
import { outboxRepository } from "../../../../shared/infrastructure/kafka/outbox/repositories";
import { StorageCreated } from "../../domain/events/storageCreated";
import type { Storage } from "../../domain/storage";
import { StorageMapper } from "../../mappers/storageMapper";

export class CreateStorageOutbox {
	public static emit(storage: Storage) {
		const event = new StorageCreated(storage);

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
