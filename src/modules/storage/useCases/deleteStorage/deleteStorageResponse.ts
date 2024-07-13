import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Storage } from "../../domain/storage";
import type { DeleteStorageErrors } from "./deleteStorageErrors";

export type DeleteStorageResponse = Either<
	| DeleteStorageErrors.StorageDoesNotExistError
	| DeleteStorageErrors.StorageHasAmountError
	| AppError.UnexpectedError
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	| Result<any>,
	Result<Storage>
>;
