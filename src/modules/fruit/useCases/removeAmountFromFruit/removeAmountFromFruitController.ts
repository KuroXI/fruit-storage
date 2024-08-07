import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { Fruit } from "../../domain/fruit";
import type { RemoveAmountFromFruit } from "./removeAmountFromFruit";
import type { IRemoveAmountFromFruitDTO } from "./removeAmountFromFruitDTO";
import { RemoveAmountFromFruitErrors } from "./removeAmountFromFruitErrors";

export class RemoveAmountFromFruitController extends BaseController<
	IRemoveAmountFromFruitDTO,
	Fruit
> {
	private _useCase: RemoveAmountFromFruit;

	constructor(useCase: RemoveAmountFromFruit) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IRemoveAmountFromFruitDTO): Promise<Fruit> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as Fruit;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		switch (error.constructor) {
			case RemoveAmountFromFruitErrors.AmountLargerThanStoredAmountError:
				this.conflict(error.getErrorValue().message);
				break;
			case RemoveAmountFromFruitErrors.FinalAmountHasToBePositiveNumber:
				this.conflict(error.getErrorValue().message);
				break;
			case RemoveAmountFromFruitErrors.FruitDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			default:
				this.badRequest(error.getErrorValue());
				break;
		}
	}
}
