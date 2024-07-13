import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";

interface IStorageFruitIdProps {
	value: string;
}

export class StorageFruitId extends ValueObject<IStorageFruitIdProps> {
	get value(): string {
		return this.props.value;
	}

	private constructor(props: IStorageFruitIdProps) {
		super(props);
	}

	public static create(props: IStorageFruitIdProps): Result<StorageFruitId> {
		const guardResult = Guard.againstNullOrUndefined(props.value, "fruitId");

		if (guardResult.isFailure) {
			return Result.fail<StorageFruitId>(guardResult.getErrorValue());
		}

		return Result.ok<StorageFruitId>(new StorageFruitId(props));
	}
}
