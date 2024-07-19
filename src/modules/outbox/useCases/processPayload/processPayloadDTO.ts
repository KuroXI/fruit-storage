export interface IOutboxPayload {
	execute(): Promise<void>;
}
