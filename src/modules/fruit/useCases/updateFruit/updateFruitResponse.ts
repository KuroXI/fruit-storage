import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Fruit } from "../../domain/fruit";
import type { UpdateFruitErrors } from "./updateFruitErrors";

export type UpdateFruitResponse = Either<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	UpdateFruitErrors.FruitDoesNotExistError | AppError.UnexpectedError | Result<any>,
	Result<Fruit>
>;
