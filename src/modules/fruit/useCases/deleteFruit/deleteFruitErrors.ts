import { Result } from "../../../../shared/core/Result";
import type { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace DeleteFruitErrors {
	export class FruitDoesNotExistError extends Result<UseCaseError> {
		constructor(name: string) {
			super(false, {
				message: `The fruit name '${name}' does not exist!`,
			} as UseCaseError);
		}
	}
}
