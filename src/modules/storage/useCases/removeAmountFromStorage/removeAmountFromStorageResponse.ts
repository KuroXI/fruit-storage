import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Storage } from "../../domain/storage";
import type { RemoveAmountFromStorageErrors } from "./removeAmountFromStorageErrors";

export type RemoveAmountFromStorageResponse = Either<
	| RemoveAmountFromStorageErrors.AmountLargerThanStoredAmountError
	| RemoveAmountFromStorageErrors.StorageDoesNotExistError
	| RemoveAmountFromStorageErrors.FinalAmountHasToBePositiveNumber
	| AppError.UnexpectedError
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	| Result<any>,
	Result<Storage>
>;
