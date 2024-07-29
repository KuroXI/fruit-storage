export interface IOutboxProcuder<T> {
	execute(payload: T): Promise<void>;
}
