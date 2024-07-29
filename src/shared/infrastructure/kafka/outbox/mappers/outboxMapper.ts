import { UniqueEntityID } from "../../../../domain/UniqueEntityID";
import { OutboxPayload } from "../outboxPayload";

export class OutboxMapper {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public static toDomain(raw: any): OutboxPayload {
		const outboxOrError = OutboxPayload.create(
			{
				eventName: raw.eventName,
				payload: raw.payload,
				processed: raw.processed,
				createdAt: raw.createdAt,
			},
			new UniqueEntityID(raw.id),
		);

		if (outboxOrError.isFailure) {
			return outboxOrError.getErrorValue();
		}

		return outboxOrError.getValue();
	}

	public static toPersistence(outbox: OutboxPayload) {
		return {
			id: outbox.id,
			eventName: outbox.eventName,
			payload: outbox.payload,
			processed: outbox.processed,
			createdAt: outbox.createdAt,
		};
	}
}
