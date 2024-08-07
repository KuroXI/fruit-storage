import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { Fruit } from "../../domain/fruit";
import type { StoreAmountToFruit } from "./storeAmountToFruit";
import type { IStoreAmountToFruitDTO } from "./storeAmountToFruitDTO";
import { StoreAmountToFruitErrors } from "./storeAmountToFruitErrors";

export class StoreAmountToFruitController extends BaseController<IStoreAmountToFruitDTO, Fruit> {
	private _useCase: StoreAmountToFruit;

	constructor(useCase: StoreAmountToFruit) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IStoreAmountToFruitDTO): Promise<Fruit> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as Fruit;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		if (error.constructor === StoreAmountToFruitErrors.FruitDoesNotExistError) {
			return this.notFound(error.getErrorValue().message);
		}

		return this.badRequest(error.getErrorValue());
	}
}
