import { consumer } from "../../../../shared/infrastructure/kafka";
import { OutboxConsumer } from "./outboxConsumer";

const outboxConsumer = new OutboxConsumer(consumer);

outboxConsumer.execute();
