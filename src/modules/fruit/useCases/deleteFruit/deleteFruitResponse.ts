import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Fruit } from "../../domain/fruit";
import type { DeleteFruitErrors } from "./deleteFruitErrors";

export type DeleteFruitResponse = Either<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	DeleteFruitErrors.FruitDoesNotExistError | AppError.UnexpectedError | Result<any>,
	Result<Fruit>
>;
