import { consumer } from "../../../kafka";
import { OutboxConsumer } from "./outboxConsumer";

const outboxConsumer = new OutboxConsumer(consumer);

outboxConsumer.execute();
