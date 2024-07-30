import { OutboxPayload } from "../../../../shared/infrastructure/kafka/outbox/outboxPayload";
import { outboxRepository } from "../../../../shared/infrastructure/kafka/outbox/repositories";
import { FruitCreated } from "../../domain/events/fruitCreated";
import type { Fruit } from "../../domain/fruit";
import { FruitMapper } from "../../mappers/fruitMapper";

export class CreateFruitOutbox {
	public static emit(fruit: Fruit) {
		const event = new FruitCreated(fruit);

		const outboxPayloadOrError = OutboxPayload.create(
			{
				eventName: event.getEventName(),
				payload: JSON.stringify(FruitMapper.toPersistence(event.getPayload())),
				processed: false,
				createdAt: event.getDateTimeOccurred(),
			},
			event.getAggregateId(),
		);
		if (outboxPayloadOrError.isFailure) throw new Error();

		outboxRepository.sendPayload(outboxPayloadOrError.getValue());
	}
}
