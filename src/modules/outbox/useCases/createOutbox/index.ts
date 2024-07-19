import { outboxRepository } from "../../repositories";
import { CreateOutbox } from "./createOutbox";

const createOutbox = new CreateOutbox(outboxRepository);

export { createOutbox };
