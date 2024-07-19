import { createOutbox } from "../../../outbox/useCases/createOutbox";
import { FruitUpdated } from "../../domain/events/fruitUpdated";
import type { Fruit } from "../../domain/fruit";

export class UpdateFruitOutbox {
	public static emit(fruit: Fruit) {
		const event = new FruitUpdated(fruit);

		createOutbox.execute({
			eventName: event.getEventName(),
			payload: JSON.stringify(event.getPayload()),
			processed: false,
			createdAt: event.getDateTimeOccurred(),
		});
	}
}
