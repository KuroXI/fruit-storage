import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { CreateFruitErrors } from "../../../fruit/useCases/createFruit/createFruitErrors";
import type { Storage } from "../../domain/storage";

export type CreateStorageResponse = Either<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	CreateFruitErrors.FruitAlreadyExistError | AppError.UnexpectedError | Result<any>,
	Result<Storage>
>;
