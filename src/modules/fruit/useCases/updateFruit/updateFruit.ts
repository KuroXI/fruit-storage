import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Fruit } from "../../domain/fruit";
import { FruitDescription } from "../../domain/fruitDescription";
import { FruitName } from "../../domain/fruitName";
import type { IFruitRepository } from "../../repositories/IFruitRepository";
import type { IUpdateFruitDTO } from "./updateFruitDTO";
import { UpdateFruitErrors } from "./updateFruitErrors";
import type { UpdateFruitResponse } from "./updateFruitResponse";

export class UpdateFruit implements UseCase<IUpdateFruitDTO, UpdateFruitResponse> {
	private _fruitRepository: IFruitRepository;
	private _unitOfWork: UnitOfWork;

	constructor(fruitRepository: IFruitRepository, unitOfWork: UnitOfWork) {
		this._fruitRepository = fruitRepository;
		this._unitOfWork = unitOfWork;
	}

	public async execute(request: IUpdateFruitDTO): Promise<UpdateFruitResponse> {
		try {
			await this._unitOfWork.startTransaction();

			const validateRequest = await this._validateRequest(request);
			if (validateRequest.isFailure) {
				await this._unitOfWork.abortTransaction();
				return left(validateRequest);
			}

			const updatedFruit = await this._updateFruit(validateRequest.getValue());

			await this._unitOfWork.commitTransaction();

			return right(Result.ok<Fruit>(updatedFruit));
		} catch (error) {
			await this._unitOfWork.abortTransaction();
			return left(new AppError.UnexpectedError(error));
		} finally {
			await this._unitOfWork.endTransaction();
		}
	}

	private async _validateRequest(request: IUpdateFruitDTO): Promise<
		Result<{
			name: FruitName;
			description: FruitDescription;
		}>
	> {
		const fruitNameOrError = FruitName.create({ value: request.name });
		const fruitDescriptionOrError = FruitDescription.create({ value: request.description });

		const fruitCombineResult = Result.combine([fruitNameOrError, fruitDescriptionOrError]);
		if (fruitCombineResult.isFailure) {
			return Result.fail(fruitCombineResult.getErrorValue());
		}

		const fruitAlreadyExists = await this._isFruitExist(fruitNameOrError.getValue());
		if (!fruitAlreadyExists) {
			return Result.fail(
				new UpdateFruitErrors.FruitDoesNotExistError(
					fruitNameOrError.getValue().props.value,
				).getErrorValue().message,
			);
		}

		return Result.ok({
			name: fruitNameOrError.getValue(),
			description: fruitDescriptionOrError.getValue(),
		});
	}

	private async _isFruitExist(name: FruitName): Promise<boolean> {
		return await this._fruitRepository.exists(name);
	}

	private async _updateFruit(props: {
		name: FruitName;
		description: FruitDescription;
	}): Promise<Fruit> {
		return await this._fruitRepository.updateFruit(props.name, props.description);
	}
}
