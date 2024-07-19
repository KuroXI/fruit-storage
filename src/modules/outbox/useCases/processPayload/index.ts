import { outboxRepository } from "../../repositories";
import { ProcessPayload } from "./processPayload";

const processPayload = new ProcessPayload(outboxRepository);

export { processPayload };
