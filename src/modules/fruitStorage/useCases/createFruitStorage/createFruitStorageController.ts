import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { CreateFruitStorage } from "./createFruitStorage";
import type { ICreateFruitStorageDTO } from "./createFruitStorageDTO";
import { CreateFruitStorageErrors } from "./createFruitStorageErrors";

export class CreateFruitStorageController extends BaseController<
	ICreateFruitStorageDTO,
	FruitStorage
> {
	private _useCase: CreateFruitStorage;

	constructor(useCase: CreateFruitStorage) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: ICreateFruitStorageDTO): Promise<FruitStorage> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as FruitStorage;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		switch (error.constructor) {
			case CreateFruitStorageErrors.FruitAlreadyExistError:
				this.conflict(error.getErrorValue().message);
				break;
			case CreateFruitStorageErrors.LimitHasToBePositiveNumber:
				this.conflict(error.getErrorValue().message);
				break;
			default:
				this.badRequest(error.getErrorValue());
				break;
		}
	}
}
