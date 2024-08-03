import { BaseController } from "../../../../shared/infrastructure/http/models/BaseController";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { FindFruitStorageByName } from "./findFruitStorageByName";
import type { IFindFruitStorageByNameDTO } from "./findFruitStorageByNameDTO";
import { FindFruitStorageByNameErrors } from "./findFruitStorageByNameErrors";

export class FindFruitStorageByNameController extends BaseController<
	IFindFruitStorageByNameDTO,
	FruitStorage
> {
	private _useCase: FindFruitStorageByName;

	constructor(useCase: FindFruitStorageByName) {
		super();
		this._useCase = useCase;
	}

	async executeImpl(request: IFindFruitStorageByNameDTO): Promise<FruitStorage> {
		const result = await this._useCase.execute(request);

		if (result.isLeft()) {
			this._handleError(result.value);
		}

		return result.value.getValue() as FruitStorage;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private _handleError(error: any) {
		switch (error.constructor) {
			case FindFruitStorageByNameErrors.FruitDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			case FindFruitStorageByNameErrors.StorageDoesNotExistError:
				this.notFound(error.getErrorValue().message);
				break;
			default:
				this.badRequest(error.getErrorValue());
				break;
		}
	}
}
