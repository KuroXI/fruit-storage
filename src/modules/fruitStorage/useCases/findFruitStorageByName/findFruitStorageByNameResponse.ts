import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { FruitStorage } from "../../domain/fruitStorage";
import type { FindFruitStorageByNameErrors } from "./findFruitStorageByNameErrors";

export type FindFruitStorageByNameResponse = Either<
	| FindFruitStorageByNameErrors.FruitDoesNotExistError
	| FindFruitStorageByNameErrors.StorageDoesNotExistError
	| AppError.UnexpectedError
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	| Result<any>,
	Result<FruitStorage>
>;
