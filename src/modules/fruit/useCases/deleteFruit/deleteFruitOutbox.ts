import { createOutbox } from "../../../outbox/useCases/createOutbox";
import { FruitDeleted } from "../../domain/events/fruitDeleted";
import type { Fruit } from "../../domain/fruit";

export class DeleteFruitOutbox {
	public static emit(fruit: Fruit) {
		const event = new FruitDeleted(fruit);

		createOutbox.execute({
			eventName: event.getEventName(),
			payload: JSON.stringify(event.getPayload()),
			processed: false,
			createdAt: event.getDateTimeOccurred(),
		});
	}
}
