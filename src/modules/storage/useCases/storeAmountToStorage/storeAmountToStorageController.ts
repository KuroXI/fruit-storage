import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { Storage } from "../../domain/storage";
import type { StoreAmountToStorage } from "./storeAmountToStorage";
import type { IStoreAmountToStorageDTO } from "./storeAmountToStorageDTO";
import { StoreAmountToStorageErrors } from "./storeAmountToStorageErrors";

export class StoreAmountToStorageController extends BaseController<
	IStoreAmountToStorageDTO,
	Storage
> {
	private _useCase: StoreAmountToStorage;

	constructor(useCase: StoreAmountToStorage) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IStoreAmountToStorageDTO): Promise<Storage> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as Storage;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		switch (error.constructor) {
			case StoreAmountToStorageErrors.AmountLargerThanLimitError:
				this.conflict(error.getErrorValue().message);
				break;
			case StoreAmountToStorageErrors.StorageDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			default:
				this.badRequest(error.getErrorValue());
				break;
		}
	}
}
