import { Result } from "../../../../shared/core/Result";
import type { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace RemoveAmountFromFruitErrors {
	export class FruitDoesNotExistError extends Result<UseCaseError> {
		constructor(name: string) {
			super(false, {
				message: `The fruit name '${name}' does not exist!`,
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
				message: "The amount of fruit to be stored cannot be a negative number.",
			} as UseCaseError);
		}
	}
}
