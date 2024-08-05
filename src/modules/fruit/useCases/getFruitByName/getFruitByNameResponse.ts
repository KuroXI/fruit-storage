import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Fruit } from "../../domain/fruit";
import type { GetFruitByNameErrors } from "./getFruitByNameErrors";

export type GetFruitByNameResponse = Either<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	GetFruitByNameErrors.FruitDoesNotExistError | AppError.UnexpectedError | Result<any>,
	Result<Fruit>
>;
