import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { Fruit } from "../../domain/fruit";
import { FruitDescription } from "../../domain/fruitDescription";
import { FruitName } from "../../domain/fruitName";
import type { IFruitRepository } from "../../repositories";
import type { UpdateFruitDTO } from "./updateFruitDTO";
import { UpdateFruitErrors } from "./updateFruitErrors";
import { UpdateFruitOutbox } from "./updateFruitOutbox";
import type { UpdateFruitResponse } from "./updateFruitResponse";

export class UpdateFruit implements UseCase<UpdateFruitDTO, UpdateFruitResponse> {
	private _fruitRepository: IFruitRepository;

	constructor(fruitRepository: IFruitRepository) {
		this._fruitRepository = fruitRepository;
	}

	public async execute(request: UpdateFruitDTO): Promise<UpdateFruitResponse> {
		try {
			const fruitNameOrError = FruitName.create({ value: request.name });
			const fruitDescriptionOrError = FruitDescription.create({ value: request.description });

			const fruitCombineResult = Result.combine([fruitNameOrError, fruitDescriptionOrError]);
			if (fruitCombineResult.isFailure) {
				return left(Result.fail(fruitCombineResult.getErrorValue()));
			}

			const fruitAlreadyExists = await this._fruitRepository.exists(fruitNameOrError.getValue());
			if (!fruitAlreadyExists) {
				return left(
					Result.fail(
						new UpdateFruitErrors.FruitDoesNotExistError(
							fruitNameOrError.getValue().value,
						).getErrorValue().message,
					),
				);
			}

			const updatedFruit = await this._fruitRepository.update(
				fruitNameOrError.getValue(),
				fruitDescriptionOrError.getValue(),
			);

			UpdateFruitOutbox.emit(updatedFruit);

			return right(Result.ok<Fruit>(updatedFruit));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}
}
