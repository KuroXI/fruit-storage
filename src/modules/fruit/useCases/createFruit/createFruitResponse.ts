import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Fruit } from "../../domain/fruit";
import type { CreateFruitErrors } from "./createFruitErrors";

export type CreateFruitResponse = Either<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	CreateFruitErrors.FruitAlreadyExistError | AppError.UnexpectedError | Result<any>,
	Result<Fruit>
>;
