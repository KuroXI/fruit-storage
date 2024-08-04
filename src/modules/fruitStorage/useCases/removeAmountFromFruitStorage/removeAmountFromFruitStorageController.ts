import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { RemoveAmountFromFruitStorage } from "./removeAmountFromFruitStorage";
import type { IRemoveAmountFromFruitStorageDTO } from "./removeAmountFromFruitStorageDTO";
import { RemoveAmountFromFruitStorageErrors } from "./removeAmountFromFruitStorageErrors";

export class RemoveAmountFromFruitStorageController extends BaseController<
	IRemoveAmountFromFruitStorageDTO,
	FruitStorage
> {
	private _useCase: RemoveAmountFromFruitStorage;

	constructor(useCase: RemoveAmountFromFruitStorage) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IRemoveAmountFromFruitStorageDTO): Promise<FruitStorage> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as FruitStorage;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		switch (error.constructor) {
			case RemoveAmountFromFruitStorageErrors.AmountLargerThanStoredAmountError:
				this.conflict(error.getErrorValue().message);
				break;
			case RemoveAmountFromFruitStorageErrors.FruitDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			case RemoveAmountFromFruitStorageErrors.StorageDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			default:
				this.badRequest(error.getErrorValue());
				break;
		}
	}
}
