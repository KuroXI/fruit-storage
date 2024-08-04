import type { Producer } from "kafkajs";
import { kafkaConfig } from "../../../../../../config";
import type { UnitOfWork } from "../../../../unitOfWork/implementations/UnitOfWork";
import { OutboxMapper } from "../../mappers/outboxMapper";
import type { OutboxPayload } from "../../outboxPayload";
import type { OutboxRepository } from "../../repositories/implementations/outboxRepository";
import type { IOutboxProcuder } from "./IOutboxProducer";
import { FRUIT_STORAGE_CREATE_EVENT_NAME } from "../../../../../../modules/fruitStorage/domain/events/fruitStorageCreated";
import { FRUIT_STORAGE_UPDATE_EVENT_NAME } from "../../../../../../modules/fruitStorage/domain/events/fruitStorageUpdated";
import { FRUIT_STORAGE_DELETE_EVENT_NAME } from "../../../../../../modules/fruitStorage/domain/events/fruitStorageDeleted";

export class OutboxProducer implements IOutboxProcuder<OutboxPayload> {
	private _producer: Producer;
	private _outboxRepository: OutboxRepository;
	private _unitOfWork: UnitOfWork;

	constructor(producer: Producer, outboxRepository: OutboxRepository, unitOfWork: UnitOfWork) {
		this._producer = producer;
		this._outboxRepository = outboxRepository;
		this._unitOfWork = unitOfWork;
	}

	async execute(): Promise<void> {
		const validEventNames = [
			FRUIT_STORAGE_CREATE_EVENT_NAME,
			FRUIT_STORAGE_UPDATE_EVENT_NAME,
			FRUIT_STORAGE_DELETE_EVENT_NAME,
		];

		const transaction = await this._producer.transaction();
		try {
			const pendings = (await this._outboxRepository.getPendings()).filter((pending) =>
				validEventNames.includes(pending.eventName),
			);
			if (!pendings.length) return await transaction.abort();

			await this._unitOfWork.startTransaction();

			for (const pending of pendings) {
				await transaction.send({
					topic: kafkaConfig.topicId,
					messages: [
						{
							key: pending.eventName,
							value: JSON.stringify(OutboxMapper.toPersistence(pending)),
						},
					],
				});

				await this._outboxRepository.markAsProcessed(pending);
			}

			await transaction.commit();
			await this._unitOfWork.commitTransaction();
		} catch (error) {
			await transaction.abort();
			await this._unitOfWork.abortTransaction();
			console.error("Something went wrong while producing", error);
		}
	}
}
