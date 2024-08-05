import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { Storage } from "../../domain/storage";
import type { RemoveAmountFromStorage } from "./removeAmountFromStorage";
import type { IRemoveAmountFromStorageDTO } from "./removeAmountFromStorageDTO";
import { RemoveAmountFromStorageErrors } from "./removeAmountFromStorageErrors";

export class RemoveAmountFromStorageController extends BaseController<
	IRemoveAmountFromStorageDTO,
	Storage
> {
	private _useCase: RemoveAmountFromStorage;

	constructor(useCase: RemoveAmountFromStorage) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IRemoveAmountFromStorageDTO): Promise<Storage> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as Storage;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		switch (error.constructor) {
			case RemoveAmountFromStorageErrors.AmountLargerThanStoredAmountError:
				this.conflict(error.getErrorValue().message);
				break;
			case RemoveAmountFromStorageErrors.FinalAmountHasToBePositiveNumber:
				this.conflict(error.getErrorValue().message);
				break;
			case RemoveAmountFromStorageErrors.StorageDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			default:
				this.badRequest(error.getErrorValue());
				break;
		}
	}
}
