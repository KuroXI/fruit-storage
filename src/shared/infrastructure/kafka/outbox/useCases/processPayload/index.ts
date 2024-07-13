import { outboxRepository } from "../../repositories/implementations";
import { ProcessPayload } from "./processPayload";

const processPayload = new ProcessPayload(outboxRepository);

export { processPayload };
