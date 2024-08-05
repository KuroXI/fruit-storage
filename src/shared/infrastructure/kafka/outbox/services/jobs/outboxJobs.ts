import type { Producer } from "kafkajs";
import { outboxProducer } from "../../../../../../modules/fruit/producer";
import type { IOutboxJobs } from "./IOutboxJobs";

export class OutboxJobs implements IOutboxJobs {
	private _producer: Producer;

	constructor(producer: Producer) {
		this._producer = producer;
	}

	async execute(): Promise<void> {
		try {
			await this._producer.connect();

			await outboxProducer.execute();

			await this._producer.disconnect();
		} catch (error) {
			await this._producer.disconnect();
			console.error("Error occur while processing outbox: ", error);
		}
	}
}
