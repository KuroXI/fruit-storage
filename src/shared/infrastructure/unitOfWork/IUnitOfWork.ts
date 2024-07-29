export interface IUnitOfWork {
	start(): Promise<void>;
	commit(): Promise<void>;
	abort(): Promise<void>;
}
