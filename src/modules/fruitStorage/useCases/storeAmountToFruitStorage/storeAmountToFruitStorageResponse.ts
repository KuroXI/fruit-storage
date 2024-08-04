import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { StoreAmountToFruitStorageErrors } from "./storeAmountToFruitStorageErrors";

export type StoreAmountToFruitStorageResponse = Either<
	| StoreAmountToFruitStorageErrors.AmountLargerThanLimitError
	| StoreAmountToFruitStorageErrors.FruitDoesNotExistError
	| StoreAmountToFruitStorageErrors.StorageDoesNotExistError
	| AppError.UnexpectedError
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	| Result<any>,
	Result<FruitStorage>
>;
