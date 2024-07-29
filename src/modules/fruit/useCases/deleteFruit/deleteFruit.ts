import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Fruit } from "../../domain/fruit";
import { FruitName } from "../../domain/fruitName";
import type { IFruitRepository } from "../../repositories/IFruitRepository";
import type { DeleteFruitDTO } from "./deleteFruitDTO";
import { DeleteFruitErrors } from "./deleteFruitErrors";
import { DeleteFruitOutbox } from "./deleteFruitOutbox";
import type { DeleteFruitResponse } from "./deleteFruitResponse";

export class DeleteFruit implements UseCase<DeleteFruitDTO, DeleteFruitResponse> {
	private _fruitRepository: IFruitRepository;
	private _unitOfWork: UnitOfWork;

	constructor(fruitRepository: IFruitRepository, unitOfWork: UnitOfWork) {
		this._fruitRepository = fruitRepository;
		this._unitOfWork = unitOfWork;
	}

	public async execute(request: DeleteFruitDTO): Promise<DeleteFruitResponse> {
		try {
			await this._unitOfWork.start();

			const fruitNameOrError = FruitName.create({ value: request.name });

			const fruitCombineResult = Result.combine([fruitNameOrError]);
			if (fruitCombineResult.isFailure) {
				return left(Result.fail<DeleteFruit>(fruitCombineResult.getErrorValue()));
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

			await this._unitOfWork.commit();
			return right(Result.ok<Fruit>(deletedFruit));
		} catch (error) {
			await this._unitOfWork.abort();
			return left(new AppError.UnexpectedError(error));
		} finally {
			await this._unitOfWork.end();
		}
	}
}
