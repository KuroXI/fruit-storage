import { OutboxPayload } from "../../../../shared/infrastructure/kafka/outbox/outboxPayload";
import { outboxRepository } from "../../../../shared/infrastructure/kafka/outbox/repositories";
import { FruitDeleted } from "../../domain/events/fruitDeleted";
import type { Fruit } from "../../domain/fruit";
import { FruitMapper } from "../../mappers/fruitMapper";

export class DeleteFruitOutbox {
	public static emit(fruit: Fruit) {
		const event = new FruitDeleted(fruit);

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
