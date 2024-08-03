import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { CreateFruitStorageErrors } from "./createFruitStorageErrors";

export type CreateFruitStorageResponse = Either<
	| CreateFruitStorageErrors.FruitAlreadyExistError
	| CreateFruitStorageErrors.LimitHasToBePositiveNumber
	| AppError.UnexpectedError
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	| Result<any>,
	Result<FruitStorage>
>;
