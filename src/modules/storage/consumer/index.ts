import { consumer } from "../../../shared/infrastructure/kafka";
import { outboxRepository } from "../../../shared/infrastructure/kafka/outbox/repositories";
import { unitOfWork } from "../../../shared/infrastructure/unitOfWork";
import { OutboxConsumer } from "./outboxConsumer";

const outboxConsumer = new OutboxConsumer(consumer, outboxRepository, unitOfWork);

outboxConsumer.execute();
