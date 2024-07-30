export interface IOutboxProcuder<T> {
	execute(payloads: T[]): Promise<void>;
}
