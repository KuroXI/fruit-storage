import cron from "node-cron";
import { cronConfig } from "../../../config";
import { processPayload } from "../kafka/outbox/useCases/processPayload";

cron.schedule(
	cronConfig.interval,
	async () => {
		try {
			await processPayload.execute();
		} catch (error) {
			console.error("Error occur while processing outbox: ", error);
		}
	},
	cronConfig.config,
);
