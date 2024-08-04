import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { DeleteFruitStorageByNameErrors } from "./deleteFruitStorageByNameErrors";

export type DeleteFruitStorageByNameResponse = Either<
	| DeleteFruitStorageByNameErrors.FruitDoesNotExistError
	| DeleteFruitStorageByNameErrors.StorageDoesNotExistError
	| DeleteFruitStorageByNameErrors.StorageHasAmountError
	| AppError.UnexpectedError
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	| Result<any>,
	Result<FruitStorage>
>;
