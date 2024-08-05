import { Result } from "../../../../shared/core/Result";
import type { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace RemoveAmountFromStorageErrors {
	export class StorageDoesNotExistError extends Result<UseCaseError> {
		constructor(id: string) {
			super(false, {
				message: `Storage ${id} doesn't exist!`,
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
	export class FinalAmountHasToBePositiveNumber extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: "The limit for fruit to be stored cannot be a negative number.",
			} as UseCaseError);
		}
	}
}
