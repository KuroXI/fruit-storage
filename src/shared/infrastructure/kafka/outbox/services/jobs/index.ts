import { producer } from "../../..";
import { OutboxJobs } from "./outboxJobs";

const outboxJobs = new OutboxJobs(producer);

export { outboxJobs };
