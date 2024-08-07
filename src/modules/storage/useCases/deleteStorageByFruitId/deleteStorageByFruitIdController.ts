import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { Storage } from "../../domain/storage";
import type { DeleteStorageByFruitId } from "./deleteStorageByFruitId";
import type { IDeleteStorageByFruitIdDTO } from "./deleteStorageByFruitIdDTO";
import { DeleteStorageByFruitIdErrors } from "./deleteStorageByFruitIdErrors";

export class DeleteStorageByFruitIdController extends BaseController<
	IDeleteStorageByFruitIdDTO,
	Storage
> {
	private _useCase: DeleteStorageByFruitId;

	constructor(useCase: DeleteStorageByFruitId) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IDeleteStorageByFruitIdDTO): Promise<Storage> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as Storage;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		if (error.constructor === DeleteStorageByFruitIdErrors.StorageDoesNotExistError) {
			return this.notFound(error.getErrorValue().message);
		}

		return this.badRequest(error.getErrorValue());
	}
}