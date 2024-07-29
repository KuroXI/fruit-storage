import { outboxRepository } from "../../repositories";
import { OutboxJobs } from "./outboxJobs";

const outboxJobs = new OutboxJobs(outboxRepository);

export { outboxJobs };
