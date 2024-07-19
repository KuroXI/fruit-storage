export interface CreateOutboxDTO {
	eventName: string;
	payload: string;
	processed: boolean;
	createdAt: Date;
}
