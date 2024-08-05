import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { Fruit } from "../../domain/fruit";
import type { GetFruitByName } from "./getFruitByName";
import type { IGetFruitByNameDTO } from "./getFruitByNameDTO";
import { GetFruitByNameErrors } from "./getFruitByNameErrors";

export class GetFruitByNameController extends BaseController<IGetFruitByNameDTO, Fruit> {
	private _useCase: GetFruitByName;

	constructor(useCase: GetFruitByName) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IGetFruitByNameDTO): Promise<Fruit> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as Fruit;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		if (error.constructor === GetFruitByNameErrors.FruitDoesNotExistError) {
			return this.notFound(error.getErrorValue().message);
		}

		return this.badRequest(error.getErrorValue());
	}
}
