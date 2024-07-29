import type { Producer } from "kafkajs";
import { kafkaConfig } from "../../../../../../config";
import { OutboxMapper } from "../../mappers/outboxMapper";
import type { OutboxPayload } from "../../outboxPayload";
import type { IOutboxProcuder } from "./IOutboxProducer";

export class OutboxProducer implements IOutboxProcuder<OutboxPayload> {
	private _producer: Producer;

	constructor(producer: Producer) {
		this._producer = producer;
	}

	async execute(payload: OutboxPayload): Promise<void> {
		try {
			await this._producer.connect();

			const records = await this._producer.send({
				topic: kafkaConfig.topicId,
				messages: [
					{
						key: payload.eventName,
						value: JSON.stringify(OutboxMapper.toPersistence(payload)),
					},
				],
			});

			console.log(`[KAFKA] Successfully produce a payload: ${JSON.stringify(records)}`);
		} catch (error) {
			console.error("Something went wrong while producing", error);
		}
	}
}
