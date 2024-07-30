import { producer } from "../../..";
import { unitOfWork } from "../../../../unitOfWork";
import { outboxRepository } from "../../repositories";
import { OutboxProducer } from "./outboxProducer";

const outboxProducer = new OutboxProducer(producer, outboxRepository, unitOfWork);

export { outboxProducer };
