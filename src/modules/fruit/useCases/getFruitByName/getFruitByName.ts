import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { Fruit } from "../../domain/fruit";
import { FruitName } from "../../domain/fruitName";
import type { IFruitRepository } from "../../repositories/IFruitRepository";
import type { IGetFruitByNameDTO } from "./getFruitByNameDTO";
import { GetFruitByNameErrors } from "./getFruitByNameErrors";
import type { GetFruitByNameResponse } from "./getFruitByNameResponse";

export class GetFruitByName implements UseCase<IGetFruitByNameDTO, GetFruitByNameResponse> {
	private _fruitRepository: IFruitRepository;

	constructor(fruitRepository: IFruitRepository) {
		this._fruitRepository = fruitRepository;
	}

	public async execute(request: IGetFruitByNameDTO): Promise<GetFruitByNameResponse> {
		try {
			const validateRequest = await this._validateRequest(request);
			if (validateRequest.isFailure) {
				return left(validateRequest);
			}

			const fruit = await this._getFruitByFruitName(validateRequest.getValue());

			return right(Result.ok<Fruit>(fruit));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}

	private async _validateRequest(request: IGetFruitByNameDTO): Promise<Result<FruitName>> {
		const fruitNameOrError = FruitName.create({ value: request.name });
		if (fruitNameOrError.isFailure) {
			return Result.fail(fruitNameOrError.getErrorValue().toString());
		}

		const fruitAlreadyExists = await this._isFruitExist(fruitNameOrError.getValue());
		if (!fruitAlreadyExists) {
			return Result.fail(
				new GetFruitByNameErrors.FruitDoesNotExistError(
					fruitNameOrError.getValue().props.value,
				).getErrorValue().message,
			);
		}

		return Result.ok(fruitNameOrError.getValue());
	}

	private async _isFruitExist(name: FruitName): Promise<boolean> {
		return await this._fruitRepository.exists(name);
	}

	private async _getFruitByFruitName(name: FruitName): Promise<Fruit> {
		return await this._fruitRepository.getFruitByName(name);
	}
}
