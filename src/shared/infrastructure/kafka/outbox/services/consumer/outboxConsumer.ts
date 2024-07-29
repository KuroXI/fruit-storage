import type { Consumer } from "kafkajs";
import { kafkaConfig } from "../../../../../../config";
import type { IOutboxConsumer } from "./IOutboxConsumer";

export class OutboxConsumer implements IOutboxConsumer {
	private _consumer: Consumer;

	constructor(consumer: Consumer) {
		this._consumer = consumer;
	}

	async execute(): Promise<void> {
		await this._consumer.connect();
		await this._consumer.subscribe({ topic: kafkaConfig.topicId });

		await this._consumer.run({
			eachMessage: async ({ message, partition }) => {
				console.log({
					partition,
					offset: message.offset,
					value: (message.value as Buffer).toString(),
				});
			},
		});
	}
}
