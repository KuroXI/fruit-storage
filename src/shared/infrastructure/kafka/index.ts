export interface IOutboxPayload {
	execute(): Promise<void>;
}

export interface IOutboxProcuder<T> {
	execute(payload: T): Promise<void>;
}

export interface IOutboxConsumer {
	execute(): Promise<void>;
}
