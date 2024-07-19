import { createOutbox } from "../../../outbox/useCases/createOutbox";
import { StorageDeleted } from "../../domain/events/storageDeleted";
import type { Storage } from "../../domain/storage";

export class DeleteStorageOutbox {
	public static emit(storage: Storage) {
		const event = new StorageDeleted(storage);

		createOutbox.execute({
			eventName: event.getEventName(),
			payload: JSON.stringify(event.getPayload()),
			processed: false,
			createdAt: event.getDateTimeOccurred(),
		});
	}
}
