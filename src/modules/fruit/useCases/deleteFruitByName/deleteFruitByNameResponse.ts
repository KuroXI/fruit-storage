import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Fruit } from "../../domain/fruit";
import type { DeleteFruitByNameErrors } from "./deleteFruitByNameErrors";

export type DeleteFruitByNameResponse = Either<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	DeleteFruitByNameErrors.FruitDoesNotExistError | AppError.UnexpectedError | Result<any>,
	Result<Fruit>
>;
