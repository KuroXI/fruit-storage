import type { Consumer, KafkaMessage } from "kafkajs";
import { kafkaConfig } from "../../../config";
import type { OutboxRepository } from "../../../shared/infrastructure/kafka/outbox/repositories/implementations/outboxRepository";
import type { UnitOfWork } from "../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import { createStorageUseCase } from "../useCases/createStorage";
import { deleteStorageByFruitIdUseCase } from "../useCases/deleteStorageByFruitId";
import type { IOutboxConsumer } from "./IOutboxConsumer";

type OutboxPayloadMessage = {
	_id: { value: string | number };
	eventName: string;
	payload: string;
	processed: boolean;
	createdAt: string;
};

export class OutboxConsumer implements IOutboxConsumer {
	private _consumer: Consumer;
	private _outboxRepository: OutboxRepository;
	private _unitOfWork: UnitOfWork;

	constructor(consumer: Consumer, outboxRepository: OutboxRepository, unitOfWork: UnitOfWork) {
		this._consumer = consumer;
		this._outboxRepository = outboxRepository;
		this._unitOfWork = unitOfWork;
	}

	async execute(): Promise<void> {
		await this._consumer.connect();
		await this._consumer.subscribe({ topic: kafkaConfig.topicId });

		try {
			await this._unitOfWork.startTransaction();

			await this._consumer.run({
				eachMessage: async ({ message }) => await this._handleMessage(message),
			});

			await this._unitOfWork.commitTransaction();
		} catch (error) {
			await this._unitOfWork.abortTransaction();
		} finally {
			await this._unitOfWork.endTransaction();
		}
	}

	private async _handleMessage(message: KafkaMessage): Promise<void> {
		const eventPayload = JSON.parse(message.value?.toString() ?? "{}") as OutboxPayloadMessage;

		console.log(`[CONSUMER] Consuming ${eventPayload._id.value}`);

		switch (eventPayload.eventName) {
			case "FRUIT_CREATE": {
				await this._handleFruitCreateEvent(eventPayload);
				await this._markPayloadAsProcessed(eventPayload._id.value);
				break;
			}
			case "FRUIT_DELETE": {
				await this._handleFruitStorageEvent(eventPayload);
				await this._markPayloadAsProcessed(eventPayload._id.value);
				break;
			}
			default:
				console.log(
					`[CONSUMER] (${eventPayload._id.value}) - Invalid Event: ${eventPayload.eventName}`,
				);
				break;
		}
	}

	private async _handleFruitCreateEvent(eventPayload: OutboxPayloadMessage) {
		const { id, limit } = JSON.parse(eventPayload.payload ?? "{}") as {
			id: string;
			limit: number;
		};

		await createStorageUseCase.execute({ fruitId: id, limitOfFruitToBeStored: limit });
	}

	private async _handleFruitStorageEvent(eventPayload: OutboxPayloadMessage) {
		const { fruitId } = JSON.parse(eventPayload.payload ?? "{}") as {
			fruitId: string;
		};

		await deleteStorageByFruitIdUseCase.execute({ fruitId });
	}

	private async _markPayloadAsProcessed(id: string | number): Promise<void> {
		await this._outboxRepository.markAsProcessed(id);
	}
}
