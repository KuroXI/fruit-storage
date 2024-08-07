import { Result } from "../../../../shared/core/Result";
import type { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace StoreAmountToFruitErrors {
	export class FruitDoesNotExistError extends Result<UseCaseError> {
		constructor(name: string) {
			super(false, {
				message: `The fruit name '${name}' does not exist!`,
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
