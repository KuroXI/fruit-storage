import { FRUIT_CREATE_EVENT_NAME } from "../../../../../../modules/fruit/domain/events/fruitCreated";
import { FRUIT_DELETE_EVENT_NAME } from "../../../../../../modules/fruit/domain/events/fruitDeleted";
import { FRUIT_UPDATE_EVENT_NAME } from "../../../../../../modules/fruit/domain/events/fruitUpdated";
import { FRUIT_STORAGE_CREATE_EVENT_NAME } from "../../../../../../modules/storage/domain/events/storageCreated";
import { FRUIT_STORAGE_DELETE_EVENT_NAME } from "../../../../../../modules/storage/domain/events/storageDeleted";
import { FRUIT_STORAGE_UPDATE_EVENT_NAME } from "../../../../../../modules/storage/domain/events/storageUpdated";
import type { OutboxRepository } from "../../repositories/implementations/outboxRepository";
import { outboxProducer } from "../producer";
import type { IOutboxJobs } from "./IOutboxJobs";

export class OutboxJobs implements IOutboxJobs {
	private _outboxRepository: OutboxRepository;

	constructor(outboxRepository: OutboxRepository) {
		this._outboxRepository = outboxRepository;
	}

	async execute(): Promise<void> {
		const validEventName = [
			FRUIT_CREATE_EVENT_NAME,
			FRUIT_UPDATE_EVENT_NAME,
			FRUIT_DELETE_EVENT_NAME,
			FRUIT_STORAGE_CREATE_EVENT_NAME,
			FRUIT_STORAGE_UPDATE_EVENT_NAME,
			FRUIT_STORAGE_DELETE_EVENT_NAME,
		];

		const pendings = await this._outboxRepository.getPendings();

		if (!pendings.length) return;

		console.log("[WORKER] Processing unprocessed payload!");
		for (const pending of pendings) {
			try {
				if (validEventName.includes(pending.eventName)) {
					await outboxProducer.execute(pending);
				} else {
					throw new Error("Invalid Event Name");
				}

				await this._outboxRepository.markAsProcessed(pending);
			} catch (error) {
				console.error("Failed to process payload: ", error);
			}
		}
	}
}