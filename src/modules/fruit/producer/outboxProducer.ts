import type { Producer, Transaction } from "kafkajs";
import { kafkaConfig } from "../../../config";
import { OutboxMapper } from "../../../shared/infrastructure/kafka/outbox/mappers/outboxMapper";
import type { OutboxPayload } from "../../../shared/infrastructure/kafka/outbox/outboxPayload";
import type { OutboxRepository } from "../../../shared/infrastructure/kafka/outbox/repositories/implementations/outboxRepository";
import type { IOutboxProcuder } from "./IOutboxProducer";

export class OutboxProducer implements IOutboxProcuder {
	private _producer: Producer;
	private _outboxRepository: OutboxRepository;

	constructor(producer: Producer, outboxRepository: OutboxRepository) {
		this._producer = producer;
		this._outboxRepository = outboxRepository;
	}

	async execute(): Promise<void> {
		const transaction = await this._producer.transaction();
		try {
			const pendings = await this._getPayloadPendings();
			if (!pendings.length) return await transaction.abort();

			await this._handleTransaction(transaction, pendings);

			await transaction.commit();
		} catch (error) {
			await transaction.abort();
			console.error("Something went wrong while producing", error);
		}
	}

	private async _handleTransaction(
		transaction: Transaction,
		payloads: OutboxPayload[],
	): Promise<void> {
		for (const payload of payloads) {
			await transaction.send({
				topic: kafkaConfig.topicId,
				messages: [
					{
						key: payload.eventName,
						value: JSON.stringify(OutboxMapper.toPersistence(payload)),
					},
				],
			});
		}
	}

	private async _getPayloadPendings(): Promise<OutboxPayload[]> {
		return await this._outboxRepository.getPendings();
	}
}
