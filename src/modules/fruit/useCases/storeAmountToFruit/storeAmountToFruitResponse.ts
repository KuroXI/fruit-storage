import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Fruit } from "../../domain/fruit";
import type { StoreAmountToFruitErrors } from "./storeAmountToFruitErrors";

export type StoreAmountToFruitResponse = Either<
	| StoreAmountToFruitErrors.AmountLargerThanLimitError
	| StoreAmountToFruitErrors.FruitDoesNotExistError
	| AppError.UnexpectedError
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	| Result<any>,
	Result<Fruit>
>;
