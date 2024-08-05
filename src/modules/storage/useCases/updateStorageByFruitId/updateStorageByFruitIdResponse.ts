import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Storage } from "../../domain/storage";
import type { UpdateStorageByFruitIdErrors } from "./updateStorageByFruitIdErrors";

export type UpdateStorageByFruitIdResponse = Either<
	| UpdateStorageByFruitIdErrors.LimitHasToBePositiveNumber
	| UpdateStorageByFruitIdErrors.StorageDoesNotExistError
	| AppError.UnexpectedError
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	| Result<any>,
	Result<Storage>
>;
