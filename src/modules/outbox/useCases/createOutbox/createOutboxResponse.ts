import type { AppError } from "../../../../shared/core/AppError";
import type { Either, Result } from "../../../../shared/core/Result";
import type { Outbox } from "../../domain/outbox";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type CreateOutboxResponse = Either<AppError.UnexpectedError | Result<any>, Result<Outbox>>;
