import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { Storage } from "../../domain/storage";
import type { CreateStorage } from "./createStorage";
import type { ICreateStorageDTO } from "./createStorageDTO";
import { CreateStorageErrors } from "./createStorageErrors";

export class CreateStorageController extends BaseController<ICreateStorageDTO, Storage> {
	private _useCase: CreateStorage;

	constructor(useCase: CreateStorage) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: ICreateStorageDTO): Promise<Storage> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as Storage;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		if (error.constructor === CreateStorageErrors.LimitHasToBePositiveNumber) {
			return this.conflict(error.getErrorValue().message);
		}

		return this.badRequest(error.getErrorValue());
	}
}
