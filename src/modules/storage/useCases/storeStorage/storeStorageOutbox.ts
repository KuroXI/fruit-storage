import { createOutbox } from "../../../outbox/useCases/createOutbox";
import { StorageUpdated } from "../../domain/events/storageUpdated";
import type { Storage } from "../../domain/storage";

export class StoreStorageOutbox {
	public static emit(storage: Storage) {
		const event = new StorageUpdated(storage);

		createOutbox.execute({
			eventName: event.getEventName(),
			payload: JSON.stringify(event.getPayload()),
			processed: false,
			createdAt: event.getDateTimeOccurred(),
		});
	}
}
