import { models } from "../../../shared/infrastructure/database/mongoose/models";
import { OutboxRepository } from "./implementations/outboxRepository";

const outboxRepository = new OutboxRepository(models.outbox);

export { outboxRepository };
