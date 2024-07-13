import { Result } from "../../../../shared/core/Result";
import type { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace StoreStorageErrors {
	export class StorageDoesNotExistError extends Result<UseCaseError> {
		constructor(name: string) {
			super(false, {
				message: `Storage ${name} doesn't exist!`,
			} as UseCaseError);
		}
	}
	export class AmountLargerThanLimitError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: "The total amount exceeds the available storage limit.",
			} as UseCaseError);
		}
	}
}
