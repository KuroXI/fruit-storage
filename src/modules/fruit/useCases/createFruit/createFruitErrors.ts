import { Result } from "../../../../shared/core/Result";
import type { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace CreateFruitErrors {
	export class FruitAlreadyExistError extends Result<UseCaseError> {
		constructor(name: string) {
			super(false, {
				message: `The fruit name '${name}' already exist!`,
			} as UseCaseError);
		}
	}
}
