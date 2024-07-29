import { consumer } from "../../..";
import { OutboxConsumer } from "./outboxConsumer";

const outboxConsumer = new OutboxConsumer(consumer);

outboxConsumer.execute();
