import { Result } from "../../../../shared/core/Result";
import type { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace DeleteFruitStorageByNameErrors {
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
	export class StorageHasAmountError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: "Fruit cannot be deleted because it still has an amount stored.",
			} as UseCaseError);
		}
	}
}
