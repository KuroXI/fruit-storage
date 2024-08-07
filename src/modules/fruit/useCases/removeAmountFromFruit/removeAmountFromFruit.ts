import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Fruit } from "../../domain/fruit";
import { FruitAmount } from "../../domain/fruitAmount";
import { FruitName } from "../../domain/fruitName";
import type { IFruitRepository } from "../../repositories/IFruitRepository";
import type { IRemoveAmountFromFruitDTO } from "./removeAmountFromFruitDTO";
import { RemoveAmountFromFruitErrors } from "./removeAmountFromFruitErrors";
import type { RemoveAmountFromFruitResponse } from "./removeAmountFromFruitResponse";

export class RemoveAmountFromFruit
	implements UseCase<IRemoveAmountFromFruitDTO, RemoveAmountFromFruitResponse>
{
	private _fruitRepository: IFruitRepository;
	private _unitOfWork: UnitOfWork;

	constructor(fruitRepository: IFruitRepository, unitOfWork: UnitOfWork) {
		this._fruitRepository = fruitRepository;
		this._unitOfWork = unitOfWork;
	}

	public async execute(request: IRemoveAmountFromFruitDTO): Promise<RemoveAmountFromFruitResponse> {
		try {
			await this._unitOfWork.startTransaction();

			const validateRequest = await this._validateRequest(request);
			if (validateRequest.isFailure) {
				await this._unitOfWork.abortTransaction();
				return left(validateRequest);
			}

			const { name, amount } = validateRequest.getValue();
			const updatedFruit = await this._removeAmountByFruitName(name, amount);

			await this._unitOfWork.commitTransaction();

			return right(Result.ok<Fruit>(updatedFruit));
		} catch (error) {
			await this._unitOfWork.abortTransaction();
			return left(new AppError.UnexpectedError(error));
		} finally {
			await this._unitOfWork.endTransaction();
		}
	}

	private async _validateRequest(
		request: IRemoveAmountFromFruitDTO,
	): Promise<Result<{ name: FruitName; amount: FruitAmount }>> {
		const fruitNameOrError = FruitName.create({ value: request.name });
		const fruitAmountOrError = FruitAmount.create({ value: request.amount });

		const fruitCombineResult = Result.combine([fruitNameOrError, fruitAmountOrError]);
		if (fruitCombineResult.isFailure) {
			return Result.fail(fruitCombineResult.getErrorValue());
		}

		const isFruitExist = await this._isFruitExist(fruitNameOrError.getValue());
		if (!isFruitExist) {
			return Result.fail(
				new RemoveAmountFromFruitErrors.FruitDoesNotExistError(request.name).getErrorValue()
					.message,
			);
		}

		const fruit = await this._getFruitByName(fruitNameOrError.getValue());
		if (fruit.amount.value < fruitAmountOrError.getValue().value) {
			return Result.fail(
				new RemoveAmountFromFruitErrors.AmountLargerThanStoredAmountError().getErrorValue().message,
			);
		}

		if (fruit.amount.value - fruitAmountOrError.getValue().value < 0) {
			return Result.fail(
				new RemoveAmountFromFruitErrors.FinalAmountHasToBePositiveNumber().getErrorValue().message,
			);
		}

		return Result.ok({
			name: fruitNameOrError.getValue(),
			amount: fruitAmountOrError.getValue(),
		});
	}

	private async _isFruitExist(name: FruitName): Promise<boolean> {
		return await this._fruitRepository.exists(name);
	}

	private async _getFruitByName(name: FruitName): Promise<Fruit> {
		return await this._fruitRepository.getFruitByName(name);
	}

	private async _removeAmountByFruitName(name: FruitName, amount: FruitAmount): Promise<Fruit> {
		return await this._fruitRepository.removeAmountByName(name, amount);
	}
}
