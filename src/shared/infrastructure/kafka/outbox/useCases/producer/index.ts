import { producer } from "../../../kafka";
import { OutboxProducer } from "../producer/outboxProducer";

const outboxProducer = new OutboxProducer(producer);

export { outboxProducer };
