import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Storage } from "../../domain/storage";
import type { GetStorageErrors } from "./getStorageErrors";

export type GetStorageResponse = Either<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	GetStorageErrors.StorageDoesNotExistError | AppError.UnexpectedError | Result<any>,
	Result<Storage>
>;
