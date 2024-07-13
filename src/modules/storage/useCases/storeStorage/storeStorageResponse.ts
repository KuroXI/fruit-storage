import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Storage } from "../../domain/storage";
import type { StoreStorageErrors } from "./storeStorageErrors";

export type StoreStorageResponse = Either<
	| StoreStorageErrors.AmountLargerThanLimitError
	| StoreStorageErrors.StorageDoesNotExistError
	| AppError.UnexpectedError
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	| Result<any>,
	Result<Storage>
>;
