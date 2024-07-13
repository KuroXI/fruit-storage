import { Result } from "../../../../shared/core/Result";
import type { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace DeleteStorageErrors {
	export class StorageHasAmountError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: "Fruit cannot be deleted because it still has an amount stored.",
			} as UseCaseError);
		}
	}
	export class StorageDoesNotExistError extends Result<UseCaseError> {
		constructor(name: string) {
			super(false, {
				message: `Storage ${name} doesn't exist!`,
			} as UseCaseError);
		}
	}
}
