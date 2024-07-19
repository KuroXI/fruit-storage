import { createOutbox } from "../../../outbox/useCases/createOutbox";
import { StorageCreated } from "../../domain/events/storageCreated";
import type { Storage } from "../../domain/storage";

export class CreateStorageOutbox {
	public static emit(storage: Storage) {
		const event = new StorageCreated(storage);

		createOutbox.execute({
			eventName: event.getEventName(),
			payload: JSON.stringify(event.getPayload()),
			processed: false,
			createdAt: event.getDateTimeOccurred(),
		});
	}
}
