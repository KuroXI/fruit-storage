import cron from "node-cron";
import { cronConfig } from "../../../config";
import { outboxJobs } from "../kafka/outbox/services/jobs";

cron.schedule(
	cronConfig.interval,
	async () => {
		try {
			await outboxJobs.execute();
		} catch (error) {
			console.error("Error occur while processing outbox: ", error);
		}
	},
	cronConfig.config,
);
