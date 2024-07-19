import { outboxRepository } from "../../repositories/implementations";
import { CreateOutbox } from "./createOutbox";

const createOutbox = new CreateOutbox(outboxRepository);

export { createOutbox };
