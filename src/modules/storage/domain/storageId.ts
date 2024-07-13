import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import type { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { ValueObject } from "../../../shared/domain/ValueObject";

export class StorageId extends ValueObject<{ value: UniqueEntityID }> {
	getStringValue(): string {
		return this.props.value.toString();
	}

	getValue(): UniqueEntityID {
		return this.props.value;
	}

	private constructor(value: UniqueEntityID) {
		super({ value });
	}

	public static create(value: UniqueEntityID): Result<StorageId> {
		const guardResult = Guard.againstNullOrUndefined(value, "id");

		if (guardResult.isFailure) {
			return Result.fail<StorageId>(guardResult.getErrorValue());
		}

		return Result.ok<StorageId>(new StorageId(value));
	}
}
