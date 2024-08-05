import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { Storage } from "../../domain/storage";
import type { UpdateStorageByFruitId } from "./updateStorageByFruitId";
import type { IUpdateStorageByFruitIdDTO } from "./updateStorageByFruitIdDTO";
import { UpdateStorageByFruitIdErrors } from "./updateStorageByFruitIdErrors";

export class UpdateStorageByFruitIdController extends BaseController<
	IUpdateStorageByFruitIdDTO,
	Storage
> {
	private _useCase: UpdateStorageByFruitId;

	constructor(useCase: UpdateStorageByFruitId) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IUpdateStorageByFruitIdDTO): Promise<Storage> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as Storage;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		switch (error.constructor) {
			case UpdateStorageByFruitIdErrors.LimitHasToBePositiveNumber:
				this.conflict(error.getErrorValue().message);
				break;
			case UpdateStorageByFruitIdErrors.StorageDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			default:
				this.badRequest(error.getErrorValue());
				break;
		}
	}
}
