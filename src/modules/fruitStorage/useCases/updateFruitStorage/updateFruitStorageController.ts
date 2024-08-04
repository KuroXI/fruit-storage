import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { UpdateFruitStorage } from "./updateFruitStorage";
import type { IUpdateFruitStorageDTO } from "./updateFruitStorageDTO";
import { UpdateFruitStorageErrors } from "./updateFruitStorageErrors";

export class UpdateFruitStorageController extends BaseController<
	IUpdateFruitStorageDTO,
	FruitStorage
> {
	private _useCase: UpdateFruitStorage;

	constructor(useCase: UpdateFruitStorage) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IUpdateFruitStorageDTO): Promise<FruitStorage> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as FruitStorage;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		switch (error.constructor) {
			case UpdateFruitStorageErrors.FruitDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			case UpdateFruitStorageErrors.LimitHasToBePositiveNumber:
				this.conflict(error.getErrorValue().message);
				break;
			case UpdateFruitStorageErrors.StorageDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			default:
				this.badRequest(error.getErrorValue());
				break;
		}
	}
}
