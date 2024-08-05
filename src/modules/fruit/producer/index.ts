import { producer } from "../../../shared/infrastructure/kafka";
import { outboxRepository } from "../../../shared/infrastructure/kafka/outbox/repositories";
import { OutboxProducer } from "./outboxProducer";

const outboxProducer = new OutboxProducer(producer, outboxRepository);

export { outboxProducer };
