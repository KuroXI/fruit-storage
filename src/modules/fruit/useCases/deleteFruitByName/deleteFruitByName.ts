import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Fruit } from "../../domain/fruit";
import { FruitName } from "../../domain/fruitName";
import type { IFruitRepository } from "../../repositories/IFruitRepository";
import type { IDeleteFruitByNameDTO } from "./deleteFruitByNameDTO";
import { DeleteFruitByNameErrors } from "./deleteFruitByNameErrors";
import { DeleteFruitByNameOutbox } from "./deleteFruitByNameOutbox";
import type { DeleteFruitByNameResponse } from "./deleteFruitByNameResponse";

export class DeleteFruitByName
	implements UseCase<IDeleteFruitByNameDTO, DeleteFruitByNameResponse>
{
	private _fruitRepository: IFruitRepository;
	private _unitOfWork: UnitOfWork;

	constructor(fruitRepository: IFruitRepository, unitOfWork: UnitOfWork) {
		this._fruitRepository = fruitRepository;
		this._unitOfWork = unitOfWork;
	}

	public async execute(request: IDeleteFruitByNameDTO): Promise<DeleteFruitByNameResponse> {
		try {
			await this._unitOfWork.startTransaction();

			const validateRequest = await this._validateRequest(request);
			if (validateRequest.isFailure) {
				await this._unitOfWork.abortTransaction();
				return left(validateRequest);
			}

			const deletedFruit = await this._deleteFruitByFruitName(validateRequest.getValue());

			await this._emitOutboxEvent(deletedFruit);

			await this._unitOfWork.commitTransaction();

			return right(Result.ok<Fruit>(deletedFruit));
		} catch (error) {
			await this._unitOfWork.abortTransaction();
			return left(new AppError.UnexpectedError(error));
		} finally {
			await this._unitOfWork.endTransaction();
		}
	}

	private async _validateRequest(request: IDeleteFruitByNameDTO): Promise<Result<FruitName>> {
		const fruitNameOrError = FruitName.create({ value: request.name });
		if (fruitNameOrError.isFailure) {
			return Result.fail(fruitNameOrError.getErrorValue().toString());
		}

		const isFruitExist = await this._isFruitExist(fruitNameOrError.getValue());
		if (!isFruitExist) {
			return Result.fail(
				new DeleteFruitByNameErrors.FruitDoesNotExistError(
					fruitNameOrError.getValue().props.value,
				).getErrorValue().message,
			);
		}

		const fruit = await this._getFruitByName(fruitNameOrError.getValue());
		if (fruit.amount.value > 0 && !request.forceDelete) {
			return Result.fail(new DeleteFruitByNameErrors.FruitHasAmountError().getErrorValue().message);
		}

		return Result.ok(fruitNameOrError.getValue());
	}

	private async _isFruitExist(name: FruitName): Promise<boolean> {
		return await this._fruitRepository.exists(name);
	}

	private async _getFruitByName(name: FruitName): Promise<Fruit> {
		return await this._fruitRepository.getFruitByName(name);
	}

	private async _deleteFruitByFruitName(name: FruitName): Promise<Fruit> {
		return await this._fruitRepository.deleteFruitByName(name);
	}

	private async _emitOutboxEvent(fruit: Fruit) {
		await DeleteFruitByNameOutbox.emit(fruit);
	}
}
