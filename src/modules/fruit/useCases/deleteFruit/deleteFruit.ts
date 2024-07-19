import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { Fruit } from "../../domain/fruit";
import { FruitName } from "../../domain/fruitName";
import type { IFruitRepo } from "../../repositories/fruitRepo";
import type { DeleteFruitDTO } from "./deleteFruitDTO";
import { DeleteFruitErrors } from "./deleteFruitErrors";
import { DeleteFruitOutbox } from "./deleteFruitOutbox";
import type { DeleteFruitResponse } from "./deleteFruitResponse";

export class DeleteFruit implements UseCase<DeleteFruitDTO, DeleteFruitResponse> {
	private _fruitRepository: IFruitRepo;

	constructor(fruitRepository: IFruitRepo) {
		this._fruitRepository = fruitRepository;
	}

	public async execute(request: DeleteFruitDTO): Promise<DeleteFruitResponse> {
		try {
			const fruitNameOrError = FruitName.create({ value: request.name });

			const fruitCombineResult = Result.combine([fruitNameOrError]);
			if (fruitCombineResult.isFailure) {
				return left(Result.fail(fruitCombineResult.getErrorValue()));
			}

			const fruitAlreadyExists = await this._fruitRepository.exists(fruitNameOrError.getValue());
			if (!fruitAlreadyExists) {
				return left(
					Result.fail(
						new DeleteFruitErrors.FruitDoesNotExistError(
							fruitNameOrError.getValue().value,
						).getErrorValue().message,
					),
				);
			}

			const deletedFruit = await this._fruitRepository.delete(fruitNameOrError.getValue());

			DeleteFruitOutbox.emit(deletedFruit);

			return right(Result.ok<Fruit>(deletedFruit));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}
}
