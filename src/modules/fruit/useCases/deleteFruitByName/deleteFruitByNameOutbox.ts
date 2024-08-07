import { OutboxPayload } from "../../../../shared/infrastructure/kafka/outbox/outboxPayload";
import { outboxRepository } from "../../../../shared/infrastructure/kafka/outbox/repositories";
import { FruitCreated } from "../../domain/events/fruitCreated";
import type { Fruit } from "../../domain/fruit";

export class DeleteFruitByNameOutbox {
	public static async emit(fruit: Fruit) {
		const event = new FruitCreated(fruit);

		const outboxPayloadOrError = OutboxPayload.create({
			eventName: event.getEventName(),
			payload: JSON.stringify(event.getPayloadToJSON()),
			processed: false,
			createdAt: event.getDateTimeOccurred(),
		});
		if (outboxPayloadOrError.isFailure) throw new Error();

		await outboxRepository.sendPayload(outboxPayloadOrError.getValue());
	}
}
