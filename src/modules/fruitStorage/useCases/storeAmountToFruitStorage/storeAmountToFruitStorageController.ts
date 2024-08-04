import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { StoreAmountToFruitStorage } from "./storeAmountToFruitStorage";
import type { IStoreAmountToFruitStorageDTO } from "./storeAmountToFruitStorageDTO";
import { StoreAmountToFruitStorageErrors } from "./storeAmountToFruitStorageErrors";

export class StoreAmountToFruitStorageController extends BaseController<
	IStoreAmountToFruitStorageDTO,
	FruitStorage
> {
	private _useCase: StoreAmountToFruitStorage;

	constructor(useCase: StoreAmountToFruitStorage) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IStoreAmountToFruitStorageDTO): Promise<FruitStorage> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as FruitStorage;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		switch (error.constructor) {
			case StoreAmountToFruitStorageErrors.AmountLargerThanLimitError:
				this.conflict(error.getErrorValue().message);
				break;
			case StoreAmountToFruitStorageErrors.FruitDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			case StoreAmountToFruitStorageErrors.StorageDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			default:
				this.badRequest(error.getErrorValue());
				break;
		}
	}
}
