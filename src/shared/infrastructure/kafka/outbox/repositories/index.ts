import { models } from "../../../database/mongoose/models";
import { OutboxRepository } from "./implementations/outboxRepository";

const outboxRepository = new OutboxRepository(models.outbox);

export { outboxRepository };
