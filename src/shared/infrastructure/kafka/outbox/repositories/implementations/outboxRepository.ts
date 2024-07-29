import type { OutboxModel } from "../../../../database/mongoose/models/Outbox";
import { OutboxMapper } from "../../mappers/outboxMapper";
import type { OutboxPayload } from "../../outboxPayload";
import type { IOutboxRepository } from "../IOutboxRepository";

export class OutboxRepository implements IOutboxRepository {
	private _model: typeof OutboxModel;

	constructor(model: typeof OutboxModel) {
		this._model = model;
	}

	async sendPayload(outbox: OutboxPayload): Promise<void> {
		const persistenceOutbox = OutboxMapper.toPersistence(outbox);
		await this._model.create(persistenceOutbox);
	}

	async getPendings(): Promise<OutboxPayload[]> {
		const pendings = await this._model.find({ processed: false }).lean();
		return pendings.map((pending) => OutboxMapper.toDomain(pending));
	}

	async markAsProcessed(outbox: OutboxPayload): Promise<void> {
		await this._model.findOneAndUpdate({ id: outbox.id }, { processed: true });
	}
}
