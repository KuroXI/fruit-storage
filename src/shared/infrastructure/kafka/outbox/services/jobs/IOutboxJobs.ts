export interface IOutboxJobs {
	execute(): Promise<void>;
}
