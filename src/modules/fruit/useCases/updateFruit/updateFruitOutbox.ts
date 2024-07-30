import { OutboxPayload } from "../../../../shared/infrastructure/kafka/outbox/outboxPayload";
import { outboxRepository } from "../../../../shared/infrastructure/kafka/outbox/repositories";
import { FruitUpdated } from "../../domain/events/fruitUpdated";
import type { Fruit } from "../../domain/fruit";
import { FruitMapper } from "../../mappers/fruitMapper";

export class UpdateFruitOutbox {
	public static emit(fruit: Fruit) {
		const event = new FruitUpdated(fruit);

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
