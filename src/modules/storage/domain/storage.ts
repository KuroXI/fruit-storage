import { Guard, type IGuardArgument } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import type { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import type { StorageFruitId } from "./storageFruitId";
import { StorageId } from "./storageId";
import type { StorageLimit } from "./storageLimit";

interface StorageProps {
	fruitId: StorageFruitId;
	limit: StorageLimit;
}

export class Storage extends AggregateRoot<StorageProps> {
	get storageId(): StorageId {
		return StorageId.create(this._id).getValue();
	}

	get fruitId(): StorageFruitId {
		return this.props.fruitId;
	}

	get limit(): StorageLimit {
		return this.props.limit;
	}

	private constructor(props: StorageProps, id?: UniqueEntityID) {
		super(props, id);
	}

	public static create(props: StorageProps, id?: UniqueEntityID): Result<Storage> {
		const guardArgs: IGuardArgument[] = [
			{ argument: props.fruitId, argumentName: "fruitId" },
			{ argument: props.limit, argumentName: "limit" },
		];

		const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);
		if (guardResult.isFailure) {
			return Result.fail<Storage>(guardResult.getErrorValue());
		}

		return Result.ok<Storage>(new Storage(props, id));
	}
}
