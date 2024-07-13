import type { ScheduleOptions } from "node-cron";

const cronConfig = {
	interval: "* * * * *",
	config: {
		name: "outbox-task",
		scheduled: true,
	} as ScheduleOptions,
};

export { cronConfig };
