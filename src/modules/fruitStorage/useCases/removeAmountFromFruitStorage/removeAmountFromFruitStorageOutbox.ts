import { OutboxPayload } from "../../../../shared/infrastructure/kafka/outbox/outboxPayload";
import { outboxRepository } from "../../../../shared/infrastructure/kafka/outbox/repositories";
import { FruitStorageUpdated } from "../../domain/events/fruitStorageUpdated";
import type { FruitStorage } from "../../domain/fruitStorage";
import { FruitStorageMapper } from "../../mappers/fruitStorageMapper";

export class RemoveAmountFromFruitStorageOutbox {
	public static emit(fruitStorage: FruitStorage) {
		const event = new FruitStorageUpdated(fruitStorage);

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

		outboxRepository.sendPayload(outboxPayloadOrError.getValue());
	}
}
