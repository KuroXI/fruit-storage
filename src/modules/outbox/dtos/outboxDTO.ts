export interface OutboxDTO {
	id: string;
	eventName: string;
	payload: string;
	processed: boolean;
	createdAt: Date;
}
