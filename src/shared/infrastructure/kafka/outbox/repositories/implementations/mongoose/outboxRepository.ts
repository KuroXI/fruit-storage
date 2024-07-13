import type { IOutboxRepository } from "../..";
import type { OutboxModel } from "../../../../../database/mongoose/models/Outbox";
import type { Outbox } from "../../../domain/outbox";
import { OutboxMapper } from "../../../mappers/outboxMapper";

export class OutboxRepository implements IOutboxRepository {
	private _models: typeof OutboxModel;

	constructor(models: typeof OutboxModel) {
		this._models = models;
	}

	async save(outbox: Outbox): Promise<void> {
		const persistenceOutbox = OutboxMapper.toPersistence(outbox);

		await this._models.create(persistenceOutbox);
	}

	async getPendings(): Promise<Outbox[]> {
		const pendings = await this._models.find({ processed: false }).lean();

		return pendings.map((pending) => OutboxMapper.toDomain(pending));
	}

	async markAsProcessed(outbox: Outbox): Promise<void> {
		await this._models.findOneAndUpdate({ id: outbox.outboxId.getValue() }, { processed: true });
	}
}
