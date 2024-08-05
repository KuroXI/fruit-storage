import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Storage } from "../../domain/storage";
import type { GetStorageByFruitIdErrors } from "./getStorageByFruitIdErrors";

export type GetStorageByFruitIdResponse = Either<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	GetStorageByFruitIdErrors.StorageDoesNotExistError | AppError.UnexpectedError | Result<any>,
	Result<Storage>
>;
