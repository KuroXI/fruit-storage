import { OutboxPayload } from "../../../../shared/infrastructure/kafka/outbox/outboxPayload";
import { outboxRepository } from "../../../../shared/infrastructure/kafka/outbox/repositories";
import { FruitStorageCreated } from "../../domain/events/fruitStorageCreated";
import type { FruitStorage } from "../../domain/fruitStorage";
import { FruitStorageMapper } from "../../mappers/fruitStorageMapper";

export class CreateFruitStorageOutbox {
	public static async emit(fruitStorage: FruitStorage) {
		const event = new FruitStorageCreated(fruitStorage);

		const outboxPayloadOrError = OutboxPayload.create(
			{
				eventName: event.getEventName(),
				payload: JSON.stringify(FruitStorageMapper.toPersistence(event.getPayload())),
				processed: false,
				createdAt: event.getDateTimeOccurred(),
			},
			event.getAggregateId(),
		);

		if (outboxPayloadOrError.isFailure) throw new Error();

		await outboxRepository.sendPayload(outboxPayloadOrError.getValue());
	}
}
