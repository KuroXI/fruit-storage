import { models } from "../../../../shared/infrastructure/database/mongoose/models";
import { OutboxRepository } from "./mongoose/outboxRepository";

const outboxRepository = new OutboxRepository(models.outbox);

export { outboxRepository };
