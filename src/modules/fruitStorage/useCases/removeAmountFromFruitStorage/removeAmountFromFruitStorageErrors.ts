import { Result } from "../../../../shared/core/Result";
import type { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace RemoveAmountFromFruitStorageErrors {
	export class AmountLargerThanStoredAmountError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: "The amount to be removed exceeds the available storage amount.",
			} as UseCaseError);
		}
	}
	export class FruitDoesNotExistError extends Result<UseCaseError> {
		constructor(name: string) {
			super(false, {
				message: `The fruit name '${name}' does not exist!`,
			} as UseCaseError);
		}
	}
	export class StorageDoesNotExistError extends Result<UseCaseError> {
		constructor(id: string) {
			super(false, {
				message: `Storage ${id} doesn't exist!`,
			} as UseCaseError);
		}
	}
}
