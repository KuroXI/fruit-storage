import { OutboxPayload } from "../../../../shared/infrastructure/kafka/outbox/outboxPayload";
import { outboxRepository } from "../../../../shared/infrastructure/kafka/outbox/repositories";
import { FruitDomainEvent } from "../../domain/events/fruitDomainEvent";
import type { Fruit } from "../../domain/fruit";

export class DeleteFruitByNameOutbox {
	public static async emit(fruit: Fruit) {
		const event = new FruitDomainEvent("FRUIT_DELETE", fruit);

		const outboxPayloadOrError = OutboxPayload.create({
			eventName: event.eventName,
			payload: JSON.stringify(event.getPayloadToJSON()),
			processed: false,
			createdAt: event.dateTimeOccurred,
		});
		if (outboxPayloadOrError.isFailure) throw new Error();

		await outboxRepository.sendPayload(outboxPayloadOrError.getValue());
	}
}
