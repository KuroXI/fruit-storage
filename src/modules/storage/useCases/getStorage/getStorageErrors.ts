import { Result } from "../../../../shared/core/Result";
import type { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace GetStorageErrors {
	export class StorageDoesNotExistError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: "Storage does not exist!",
			} as UseCaseError);
		}
	}
}
