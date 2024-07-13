import { Result } from "../../../../shared/core/Result";
import type { UseCaseError } from "../../../../shared/core/UseCaseError";

export namespace CreateStorageErrors {
	export class LimitHasToBePositiveNumber extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: "The limit for fruit to be stored cannot be a negative number.",
			} as UseCaseError);
		}
	}
}
