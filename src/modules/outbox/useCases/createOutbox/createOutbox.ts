import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Outbox } from "../../domain/outbox";
import { OutboxCreatedAt } from "../../domain/outboxCreatedAt";
import { OutboxEventName } from "../../domain/outboxEventName";
import { OutboxId } from "../../domain/outboxId";
import { OutboxPayload } from "../../domain/outboxPayload";
import { OutboxProcessed } from "../../domain/outboxProcessed";
import type { IOutboxRepository } from "../../repositories";
import type { CreateOutboxDTO } from "./createOutboxDTO";
import type { CreateOutboxResponse } from "./createOutboxResponse";

export class CreateOutbox implements UseCase<CreateOutboxDTO, CreateOutboxResponse> {
	private _outboxRepository: IOutboxRepository;

	constructor(outboxRepository: IOutboxRepository) {
		this._outboxRepository = outboxRepository;
	}

	public async execute(request: CreateOutboxDTO): Promise<CreateOutboxResponse> {
		try {
			const outboxIdOrError = OutboxId.create(new UniqueEntityID());
			const outboxEventNameOrError = OutboxEventName.create({ value: request.eventName });
			const outboxPayloadOrError = OutboxPayload.create({ value: request.payload });
			const outboxProcessedOrError = OutboxProcessed.create({ value: request.processed });
			const outboxCreatedAtOrError = OutboxCreatedAt.create({ value: request.createdAt });

			const outboxCombineResult = Result.combine([
				outboxIdOrError,
				outboxEventNameOrError,
				outboxPayloadOrError,
				outboxProcessedOrError,
				outboxCreatedAtOrError,
			]);
			if (outboxCombineResult.isFailure) {
				return left(Result.fail(outboxCombineResult.getErrorValue()));
			}

			const outboxId = outboxIdOrError.getValue();
			const outboxEventName = outboxEventNameOrError.getValue();
			const outboxPayload = outboxPayloadOrError.getValue();
			const outboxProcessed = outboxProcessedOrError.getValue();
			const outboxCreateAt = outboxCreatedAtOrError.getValue();

			const outbox = Outbox.create(
				{
					eventName: outboxEventName,
					payload: outboxPayload,
					processed: outboxProcessed,
					createdAt: outboxCreateAt,
				},
				outboxId.getValue(),
			);

			await this._outboxRepository.save(outbox.getValue());

			return right(Result.ok<Outbox>(outbox.getValue()));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}
}
