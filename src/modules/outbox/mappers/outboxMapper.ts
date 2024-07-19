import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Outbox } from "../domain/outbox";
import { OutboxCreatedAt } from "../domain/outboxCreatedAt";
import { OutboxEventName } from "../domain/outboxEventName";
import { OutboxPayload } from "../domain/outboxPayload";
import { OutboxProcessed } from "../domain/outboxProcessed";

export class OutboxMapper {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public static toDomain(raw: any): Outbox {
		const outboxOrError = Outbox.create(
			{
				eventName: OutboxEventName.create({ value: raw.eventName }).getValue(),
				payload: OutboxPayload.create({ value: raw.payload }).getValue(),
				processed: OutboxProcessed.create({ value: raw.processed }).getValue(),
				createdAt: OutboxCreatedAt.create({ value: raw.createdAt }).getValue(),
			},
			new UniqueEntityID(raw.id),
		);

		if (outboxOrError.isFailure) {
			console.log(outboxOrError.getErrorValue());
			return outboxOrError.getErrorValue();
		}

		return outboxOrError.getValue();
	}

	public static toPersistence(outbox: Outbox) {
		return {
			id: outbox.outboxId.getValue(),
			eventName: outbox.eventName.value,
			payload: outbox.payload.value,
			processed: outbox.processed.value,
			createdAt: outbox.createdAt.value,
		};
	}

	public static toJSON(outbox: Outbox) {
		return {
			id: outbox.outboxId.getStringValue(),
			eventName: outbox.eventName.value,
			payload: outbox.payload.value,
			processed: outbox.processed.value,
			createdAt: outbox.createdAt.value,
		};
	}
}
