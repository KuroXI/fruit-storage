import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { RemoveAmountFromFruitStorageErrors } from "./removeAmountFromFruitStorageErrors";

export type RemoveAmountFromFruitStorageResponse = Either<
	| RemoveAmountFromFruitStorageErrors.AmountLargerThanStoredAmountError
	| RemoveAmountFromFruitStorageErrors.FruitDoesNotExistError
	| RemoveAmountFromFruitStorageErrors.StorageDoesNotExistError
	| AppError.UnexpectedError
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	| Result<any>,
	Result<FruitStorage>
>;
