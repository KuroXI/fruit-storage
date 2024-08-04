import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { DeleteFruitStorageByName } from "./deleteFruitStorageByName";
import type { IDeleteFruitStorageByNameDTO } from "./deleteFruitStorageByNameDTO";
import { DeleteFruitStorageByNameErrors } from "./deleteFruitStorageByNameErrors";

export class DeleteFruitStorageByNameController extends BaseController<
	IDeleteFruitStorageByNameDTO,
	FruitStorage
> {
	private _useCase: DeleteFruitStorageByName;

	constructor(useCase: DeleteFruitStorageByName) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IDeleteFruitStorageByNameDTO): Promise<FruitStorage> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as FruitStorage;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		switch (error.constructor) {
			case DeleteFruitStorageByNameErrors.FruitDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			case DeleteFruitStorageByNameErrors.StorageDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			case DeleteFruitStorageByNameErrors.StorageHasAmountError:
				this.conflict(error.getErrorValue().message);
				break;
			default:
				this.badRequest(error.getErrorValue());
				break;
		}
	}
}
