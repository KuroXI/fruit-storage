import { Guard, type IGuardArgument } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import type { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import type { Fruit } from "./fruit";
import type { StorageAmount } from "./storageAmount";
import { StorageId } from "./storageId";
import type { StorageLimit } from "./storageLimit";

interface FruitStorageProps {
	fruit: Fruit;
	limit: StorageLimit;
	amount: StorageAmount;
}

export class FruitStorage extends AggregateRoot<FruitStorageProps> {
	get storageId(): StorageId {
		return StorageId.create(this._id).getValue();
	}

	get fruitId(): UniqueEntityID {
		return this.props.fruit.fruitId.getValue();
	}

	get fruit(): Fruit {
		return this.props.fruit;
	}

	get limit(): StorageLimit {
		return this.props.limit;
	}

	get amount(): StorageAmount {
		return this.props.amount;
	}

	private constructor(props: FruitStorageProps, id?: UniqueEntityID) {
		super(props, id);
	}

	public static create(props: FruitStorageProps, id?: UniqueEntityID): Result<FruitStorage> {
		const guardArgs: IGuardArgument[] = [
			{ argument: props.fruit, argumentName: "fruit" },
			{ argument: props.limit, argumentName: "limit" },
			{ argument: props.amount, argumentName: "amount" },
		];

		const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);
		if (guardResult.isFailure) {
			return Result.fail<FruitStorage>(guardResult.getErrorValue());
		}

		return Result.ok<FruitStorage>(new FruitStorage(props, id));
	}
}
