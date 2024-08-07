import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Fruit } from "../../domain/fruit";
import type { RemoveAmountFromFruitErrors } from "./removeAmountFromFruitErrors";

export type RemoveAmountFromFruitResponse = Either<
	| RemoveAmountFromFruitErrors.AmountLargerThanStoredAmountError
	| RemoveAmountFromFruitErrors.FruitDoesNotExistError
	| RemoveAmountFromFruitErrors.FinalAmountHasToBePositiveNumber
	| AppError.UnexpectedError
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	| Result<any>,
	Result<Fruit>
>;
