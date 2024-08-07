import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Fruit } from "../../domain/fruit";
import { FruitAmount } from "../../domain/fruitAmount";
import { FruitName } from "../../domain/fruitName";
import type { IFruitRepository } from "../../repositories/IFruitRepository";
import type { IStoreAmountToFruitDTO } from "./storeAmountToFruitDTO";
import { StoreAmountToFruitErrors } from "./storeAmountToFruitErrors";
import type { StoreAmountToFruitResponse } from "./storeAmountToFruitResponse";

export class StoreAmountToFruit
	implements UseCase<IStoreAmountToFruitDTO, StoreAmountToFruitResponse>
{
	private _fruitRepository: IFruitRepository;
	private _unitOfWork: UnitOfWork;

	constructor(fruitRepository: IFruitRepository, unitOfWork: UnitOfWork) {
		this._fruitRepository = fruitRepository;
		this._unitOfWork = unitOfWork;
	}

	public async execute(request: IStoreAmountToFruitDTO): Promise<StoreAmountToFruitResponse> {
		try {
			await this._unitOfWork.startTransaction();

			const validateRequest = await this._validateRequest(request);
			if (validateRequest.isFailure) {
				await this._unitOfWork.abortTransaction();
				return left(validateRequest);
			}

			const { name, amount } = validateRequest.getValue();
			const updatedStorage = await this._storeAmountByFruitId(name, amount);

			await this._unitOfWork.commitTransaction();

			return right(Result.ok<Fruit>(updatedStorage));
		} catch (error) {
			await this._unitOfWork.abortTransaction();
			return left(new AppError.UnexpectedError(error));
		} finally {
			await this._unitOfWork.endTransaction();
		}
	}

	private async _validateRequest(
		request: IStoreAmountToFruitDTO,
	): Promise<Result<{ name: FruitName; amount: FruitAmount }>> {
		const fruitNameOrError = FruitName.create({ value: request.name });
		const fruitAmountOrError = FruitAmount.create({ value: request.amount });

		const fruitCombineResult = Result.combine([fruitNameOrError, fruitAmountOrError]);
		if (fruitCombineResult.isFailure) {
			return Result.fail(fruitCombineResult.getErrorValue());
		}

		const fruit = await this._getFruitByName(fruitNameOrError.getValue());
		if (!fruit) {
			return Result.fail(
				new StoreAmountToFruitErrors.FruitDoesNotExistError(request.name).getErrorValue().message,
			);
		}

		if (request.limit < fruit.amount.value + fruitAmountOrError.getValue().value) {
			return Result.fail(
				new StoreAmountToFruitErrors.AmountLargerThanLimitError().getErrorValue().message,
			);
		}

		return Result.ok({
			name: fruitNameOrError.getValue(),
			amount: fruitAmountOrError.getValue(),
		});
	}

	private async _storeAmountByFruitId(name: FruitName, amount: FruitAmount): Promise<Fruit> {
		return await this._fruitRepository.storeAmountByName(name, amount);
	}

	private async _getFruitByName(name: FruitName): Promise<Fruit> {
		return await this._fruitRepository.getFruitByName(name);
	}
}
