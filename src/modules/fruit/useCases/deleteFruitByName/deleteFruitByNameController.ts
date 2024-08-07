import { AppError } from "../../../../shared/core/AppError";
import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { Fruit } from "../../domain/fruit";
import type { DeleteFruitByName } from "./deleteFruitByName";
import type { IDeleteFruitByNameDTO } from "./deleteFruitByNameDTO";
import { DeleteFruitByNameErrors } from "./deleteFruitByNameErrors";

export class DeleteFruitByNameController extends BaseController<IDeleteFruitByNameDTO, Fruit> {
	private _useCase: DeleteFruitByName;

	constructor(useCase: DeleteFruitByName) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IDeleteFruitByNameDTO): Promise<Fruit> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as Fruit;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		switch (error.constructor) {
			case DeleteFruitByNameErrors.FruitDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			case DeleteFruitByNameErrors.FruitHasAmountError:
				this.conflict(error.getErrorValue().message);
				break;
			case AppError.UnexpectedError:
				this.badRequest(error.getErrorValue().message);
				break;
			default:
				this.badRequest(error.getErrorValue());
				break;
		}
	}
}
