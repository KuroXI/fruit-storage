import { Result } from "../../../shared/core/Result";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Storage } from "../domain/storage";
import { StorageFruitId } from "../domain/storageFruitId";
import { StorageLimit } from "../domain/storageLimit";

interface IStorageFactoryProps {
	storageId?: string | number;
	fruitId: string;
	limit: number;
}

export class StorageFactory {
	static create({ storageId, fruitId, limit }: IStorageFactoryProps): Result<Storage> {
		const storageFruitIdOrError = StorageFruitId.create({ value: fruitId });
		const storageLimitOrError = StorageLimit.create({ value: limit });

		const fruitCombineResult = Result.combine([storageFruitIdOrError, storageLimitOrError]);
		if (fruitCombineResult.isFailure) {
			return Result.fail(fruitCombineResult.getErrorValue());
		}

		const storageOrError = Storage.create(
			{
				fruitId: storageFruitIdOrError.getValue(),
				limit: storageLimitOrError.getValue(),
			},
			new UniqueEntityID(storageId),
		);
		if (storageOrError.isFailure) {
			return Result.fail(storageOrError.getErrorValue().toString());
		}

		return Result.ok(storageOrError.getValue());
	}
}
