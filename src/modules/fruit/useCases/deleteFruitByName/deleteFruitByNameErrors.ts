import { Result } from "../../../../shared/core/Result";
import type { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace DeleteFruitByNameErrors {
	export class FruitDoesNotExistError extends Result<UseCaseError> {
		constructor(name: string) {
			super(false, {
				message: `The fruit name '${name}' does not exist!`,
			} as UseCaseError);
		}
	}
	export class FruitHasAmountError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: "Fruit cannot be deleted because it still has an amount stored.",
			} as UseCaseError);
		}
	}
}
