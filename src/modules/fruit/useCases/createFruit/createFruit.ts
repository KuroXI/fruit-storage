import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import type { Fruit } from "../../domain/fruit";
import { FruitDescription } from "../../domain/fruitDescription";
import { FruitName } from "../../domain/fruitName";
import { FruitFactory } from "../../factory/fruitFactory";
import type { IFruitRepository } from "../../repositories/IFruitRepository";
import type { ICreateFruitDTO } from "./createFruitDTO";
import { CreateFruitErrors } from "./createFruitErrors";
import { CreateFruitOutbox } from "./createFruitOutbox";
import type { CreateFruitResponse } from "./createFruitResponse";

export class CreateFruit implements UseCase<ICreateFruitDTO, CreateFruitResponse> {
	private _fruitRepository: IFruitRepository;
	private _unitOfWork: UnitOfWork;

	constructor(fruitRepository: IFruitRepository, unitOfWork: UnitOfWork) {
		this._fruitRepository = fruitRepository;
		this._unitOfWork = unitOfWork;
	}

	public async execute(request: ICreateFruitDTO): Promise<CreateFruitResponse> {
		try {
			await this._unitOfWork.startTransaction();

			const validateRequest = await this._validateRequest(request);
			if (validateRequest.isFailure) {
				await this._unitOfWork.abortTransaction();
				return left(validateRequest);
			}

			const fruitOrError = this._createFruit(request.name, request.description);
			if (fruitOrError.isFailure) {
				await this._unitOfWork.abortTransaction();
				return left(fruitOrError);
			}

			await this._saveFruit(fruitOrError.getValue());

			await this._emitOutboxEvent(fruitOrError.getValue(), request.limitOfFruitToBeStored);

			await this._unitOfWork.commitTransaction();

			return right(Result.ok(fruitOrError.getValue()));
		} catch (error) {
			await this._unitOfWork.abortTransaction();
			return left(new AppError.UnexpectedError(error));
		} finally {
			await this._unitOfWork.endTransaction();
		}
	}

	private async _validateRequest(request: ICreateFruitDTO): Promise<Result<void>> {
		const fruitNameOrError = FruitName.create({ value: request.name });
		const fruitDescriptionOrError = FruitDescription.create({ value: request.description });

		const fruitCombineResult = Result.combine([fruitNameOrError, fruitDescriptionOrError]);
		if (fruitCombineResult.isFailure) {
			return Result.fail(fruitCombineResult.getErrorValue().toString());
		}

		const isFruitExist = await this._isFruitExist(fruitNameOrError.getValue());
		if (isFruitExist) {
			return Result.fail(
				new CreateFruitErrors.FruitAlreadyExistError(
					fruitNameOrError.getValue().props.value,
				).getErrorValue().message,
			);
		}

		return Result.ok();
	}

	private _createFruit(name: string, description: string): Result<Fruit> {
		return FruitFactory.create({ name, description });
	}

	private async _isFruitExist(name: FruitName): Promise<boolean> {
		return await this._fruitRepository.exists(name);
	}

	private async _saveFruit(fruit: Fruit): Promise<void> {
		await this._fruitRepository.saveFruit(fruit);
	}

	private async _emitOutboxEvent(fruit: Fruit, limit: number) {
		await CreateFruitOutbox.emit(fruit, limit);
	}
}
