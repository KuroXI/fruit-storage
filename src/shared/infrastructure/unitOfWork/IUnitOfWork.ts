export interface IUnitOfWork {
	startTransaction(): Promise<void>;
	commitTransaction(): Promise<void>;
	abortTransaction(): Promise<void>;
	endTransaction(): Promise<void>;
}
