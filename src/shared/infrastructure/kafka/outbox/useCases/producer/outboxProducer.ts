import type { Producer } from "kafkajs";
import type { IOutboxProcuder } from "../../..";
import type { Outbox } from "../../domain/outbox";
import { OutboxMapper } from "../../mappers/outboxMapper";
import { kafkaConfig } from "../../../../../../config";

export class OutboxProducer implements IOutboxProcuder<Outbox> {
	private _producer: Producer;

	constructor(producer: Producer) {
		this._producer = producer;
	}

	async execute(payload: Outbox): Promise<void> {
		try {
			await this._producer.connect();

			const records = await this._producer.send({
				topic: kafkaConfig.topicId,
				messages: [
					{
						key: payload.eventName.value,
						value: JSON.stringify(OutboxMapper.toJSON(payload)),
					},
				],
			});

			console.log(`[KAFKA] Successfully produce a payload: ${JSON.stringify(records, null, 2)}`);
		} catch (error) {
			console.error("Something went wrong while producing", error);
		}
	}
}
