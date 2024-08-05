export interface IOutboxProcuder {
	execute(): Promise<void>;
}
