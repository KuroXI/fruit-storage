import { OutboxPayload } from "../../../../shared/infrastructure/kafka/outbox/outboxPayload";
import { outboxRepository } from "../../../../shared/infrastructure/kafka/outbox/repositories";
import { FruitDomainEvent } from "../../domain/events/fruitDomainEvent";
import type { Fruit } from "../../domain/fruit";

export class CreateFruitOutbox {
	public static async emit(fruit: Fruit, limit: number) {
		const event = new FruitDomainEvent("FRUIT_CREATE", fruit);

		const outboxPayloadOrError = OutboxPayload.create({
			eventName: event.eventName,
			payload: JSON.stringify({
				...event.getPayloadToJSON(),
				limit,
			}),
			processed: false,
			createdAt: event.dateTimeOccurred,
		});
		if (outboxPayloadOrError.isFailure) throw new Error();

		await outboxRepository.sendPayload(outboxPayloadOrError.getValue());
	}
}
