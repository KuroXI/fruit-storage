import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { UpdateFruitStorageErrors } from "./updateFruitStorageErrors";

export type UpdateFruitStorageResponse = Either<
	| UpdateFruitStorageErrors.FruitDoesNotExistError
	| UpdateFruitStorageErrors.LimitHasToBePositiveNumber
	| UpdateFruitStorageErrors.StorageDoesNotExistError
	| AppError.UnexpectedError
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	| Result<any>,
	Result<FruitStorage>
>;
