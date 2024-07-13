import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Storage } from "../../domain/storage";
import type { RemoveStorageErrors } from "./removeStorageErrors";

export type RemoveStorageResponse = Either<
	| RemoveStorageErrors.AmountLargerThanStoredAmountError
	| RemoveStorageErrors.StorageDoesNotExistError
	| AppError.UnexpectedError
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	| Result<any>,
	Result<Storage>
>;
