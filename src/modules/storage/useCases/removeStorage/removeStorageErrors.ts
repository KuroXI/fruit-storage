import { Result } from "../../../../shared/core/Result";
import type { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace RemoveStorageErrors {
	export class StorageDoesNotExistError extends Result<UseCaseError> {
		constructor(name: string) {
			super(false, {
				message: `Storage ${name} doesn't exist!`,
			} as UseCaseError);
		}
	}
	export class AmountLargerThanStoredAmountError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: "The amount to be removed exceeds the available storage amount.",
			} as UseCaseError);
		}
	}
}
