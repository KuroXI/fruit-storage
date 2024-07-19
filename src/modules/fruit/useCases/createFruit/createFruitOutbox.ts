import { createOutbox } from "../../../outbox/useCases/createOutbox";
import { FruitCreated } from "../../domain/events/fruitCreated";
import type { Fruit } from "../../domain/fruit";

export class CreateFruitOutbox {
	public static emit(fruit: Fruit) {
		const event = new FruitCreated(fruit);

		createOutbox.execute({
			eventName: event.getEventName(),
			payload: JSON.stringify(event.getPayload()),
			processed: false,
			createdAt: event.getDateTimeOccurred(),
		});
	}
}
