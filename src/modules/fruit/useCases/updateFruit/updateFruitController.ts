import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { Fruit } from "../../domain/fruit";
import type { UpdateFruit } from "./updateFruit";
import type { IUpdateFruitDTO } from "./updateFruitDTO";
import { UpdateFruitErrors } from "./updateFruitErrors";

export class UpdateFruitController extends BaseController<IUpdateFruitDTO, Fruit> {
	private _useCase: UpdateFruit;

	constructor(useCase: UpdateFruit) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IUpdateFruitDTO): Promise<Fruit> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as Fruit;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		if (error.constructor === UpdateFruitErrors.FruitDoesNotExistError) {
			return this.notFound(error.getErrorValue().message);
		}

		return this.badRequest(error.getErrorValue());
	}
}
