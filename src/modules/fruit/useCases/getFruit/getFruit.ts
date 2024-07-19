import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { Fruit } from "../../domain/fruit";
import { FruitName } from "../../domain/fruitName";
import type { IFruitRepo } from "../../repositories/fruitRepo";
import type { GetFruitDTO } from "./getFruitDTO";
import { GetFruitErrors } from "./getFruitErrors";
import type { GetFruitResponse } from "./getFruitResponse";

export class GetFruit implements UseCase<GetFruitDTO, GetFruitResponse> {
	private _fruitRepository: IFruitRepo;

	constructor(fruitRepository: IFruitRepo) {
		this._fruitRepository = fruitRepository;
	}

	public async execute(request: GetFruitDTO): Promise<GetFruitResponse> {
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
						new GetFruitErrors.FruitDoesNotExistError(
							fruitNameOrError.getValue().value,
						).getErrorValue().message,
					),
				);
			}

			const fruit = await this._fruitRepository.getFruit(fruitNameOrError.getValue());

			return right(Result.ok<Fruit>(fruit));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}
}
