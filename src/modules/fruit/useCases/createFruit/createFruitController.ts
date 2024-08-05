import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { Fruit } from "../../domain/fruit";
import type { CreateFruit } from "./createFruit";
import type { ICreateFruitDTO } from "./createFruitDTO";
import { CreateFruitErrors } from "./createFruitErrors";

export class CreateFruitController extends BaseController<ICreateFruitDTO, Fruit> {
	private _useCase: CreateFruit;

	constructor(useCase: CreateFruit) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: ICreateFruitDTO): Promise<Fruit> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as Fruit;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		if (error.constructor === CreateFruitErrors.FruitAlreadyExistError) {
			return this.conflict(error.getErrorValue().message);
		}

		return this.badRequest(error.getErrorValue());
	}
}
