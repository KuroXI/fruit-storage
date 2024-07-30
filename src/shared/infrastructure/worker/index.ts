import cron from "node-cron";
import { cronConfig } from "../../../config";
import { outboxProducer } from "../kafka/outbox/services/producer";

cron.schedule(
	cronConfig.interval,
	async () => {
		try {
			await outboxProducer.execute();
		} catch (error) {
			console.error("Error occur while processing outbox: ", error);
		}
	},
	cronConfig.config,
);
