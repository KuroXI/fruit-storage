import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Fruit } from "../../domain/fruit";
import type { GetFruitErrors } from "./getFruitErrors";

export type GetFruitResponse = Either<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	GetFruitErrors.FruitDoesNotExistError | AppError.UnexpectedError | Result<any>,
	Result<Fruit>
>;
