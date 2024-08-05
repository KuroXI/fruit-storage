import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Fruit } from "../../domain/fruit";
import { FruitName } from "../../domain/fruitName";
import type { IFruitRepository } from "../../repositories/IFruitRepository";
import type { IDeleteFruitByNameDTO } from "./deleteFruitByNameDTO";
import { DeleteFruitByNameErrors } from "./deleteFruitByNameErrors";
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
				return left(validateRequest);
			}

			const deletedFruit = await this._deleteFruitByFruitName(validateRequest.getValue());

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

		const fruitAlreadyExists = await this._isFruitExist(fruitNameOrError.getValue());
		if (!fruitAlreadyExists) {
			return Result.fail(
				new DeleteFruitByNameErrors.FruitDoesNotExistError(
					fruitNameOrError.getValue().props.value,
				).getErrorValue().message,
			);
		}

		return Result.ok(fruitNameOrError.getValue());
	}

	private async _isFruitExist(name: FruitName): Promise<boolean> {
		return await this._fruitRepository.exists(name);
	}

	private async _deleteFruitByFruitName(name: FruitName): Promise<Fruit> {
		return await this._fruitRepository.deleteFruitByName(name);
	}
}
