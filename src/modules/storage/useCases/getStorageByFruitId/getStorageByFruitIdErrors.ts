import { Result } from "../../../../shared/core/Result";
import type { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace GetStorageByFruitIdErrors {
	export class StorageDoesNotExistError extends Result<UseCaseError> {
		constructor(id: string) {
			super(false, {
				message: `Storage ${id} doesn't exist!`,
			} as UseCaseError);
		}
	}
}
