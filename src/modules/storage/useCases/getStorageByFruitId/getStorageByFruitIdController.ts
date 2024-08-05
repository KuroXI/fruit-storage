import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { Storage } from "../../domain/storage";
import type { GetStorageByFruitId } from "./getStorageByFruitId";
import type { IGetStorageByFruitIdDTO } from "./getStorageByFruitIdDTO";
import { GetStorageByFruitIdErrors } from "./getStorageByFruitIdErrors";

export class GetStorageByFruitIdController extends BaseController<
	IGetStorageByFruitIdDTO,
	Storage
> {
	private _useCase: GetStorageByFruitId;

	constructor(useCase: GetStorageByFruitId) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IGetStorageByFruitIdDTO): Promise<Storage> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as Storage;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		if (error.constructor === GetStorageByFruitIdErrors.StorageDoesNotExistError) {
			return this.notFound(error.getErrorValue().message);
		}

		return this.badRequest(error.getErrorValue());
	}
}
