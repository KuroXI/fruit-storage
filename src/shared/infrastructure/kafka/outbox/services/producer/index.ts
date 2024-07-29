import { producer } from "../../..";
import { OutboxProducer } from "./outboxProducer";

const outboxProducer = new OutboxProducer(producer);

export { outboxProducer };
