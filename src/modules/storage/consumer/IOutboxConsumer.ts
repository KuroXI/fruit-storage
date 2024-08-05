export interface IOutboxConsumer {
	execute(): Promise<void>;
}
