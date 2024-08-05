import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Storage } from "../../domain/storage";
import type { StoreAmountToStorageErrors } from "./storeAmountToStorageErrors";

export type StoreAmountToStorageResponse = Either<
	| StoreAmountToStorageErrors.AmountLargerThanLimitError
	| StoreAmountToStorageErrors.StorageDoesNotExistError
	| AppError.UnexpectedError
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	| Result<any>,
	Result<Storage>
>;
