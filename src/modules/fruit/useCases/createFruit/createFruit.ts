import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import type { UnitOfWork } from "../../../../shared/infrastructure/unitOfWork/implementations/UnitOfWork";
import { Fruit } from "../../domain/fruit";
import { FruitDescription } from "../../domain/fruitDescription";
import { FruitId } from "../../domain/fruitId";
import { FruitName } from "../../domain/fruitName";
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
				return left(validateRequest);
			}

			const fruit = await this._createFruit(validateRequest.getValue());
			await this._saveFruit(fruit.getValue());

			CreateFruitOutbox.emit(fruit.getValue(), request.limitOfFruitToBeStored);

			await this._unitOfWork.commitTransaction();

			return right(Result.ok<Fruit>(fruit.getValue()));
		} catch (error) {
			await this._unitOfWork.abortTransaction();
			return left(new AppError.UnexpectedError(error));
		} finally {
			await this._unitOfWork.endTransaction();
		}
	}

	private async _validateRequest(request: ICreateFruitDTO): Promise<
		Result<{
			fruitId: FruitId;
			name: FruitName;
			description: FruitDescription;
		}>
	> {
		const fruitIdOrError = FruitId.create(new UniqueEntityID());
		const fruitNameOrError = FruitName.create({ value: request.name });
		const fruitDescriptionOrError = FruitDescription.create({ value: request.description });

		const fruitCombineResult = Result.combine([
			fruitIdOrError,
			fruitNameOrError,
			fruitDescriptionOrError,
		]);
		if (fruitCombineResult.isFailure) {
			return Result.fail(fruitCombineResult.getErrorValue());
		}

		const fruitAlreadyExists = await this._isFruitExist(fruitNameOrError.getValue());
		if (fruitAlreadyExists) {
			return Result.fail(
				new CreateFruitErrors.FruitAlreadyExistError(
					fruitNameOrError.getValue().props.value,
				).getErrorValue().message,
			);
		}

		return Result.ok({
			fruitId: fruitIdOrError.getValue(),
			name: fruitNameOrError.getValue(),
			description: fruitDescriptionOrError.getValue(),
		});
	}

	private async _createFruit(props: {
		fruitId: FruitId;
		name: FruitName;
		description: FruitDescription;
	}): Promise<Result<Fruit>> {
		const fruitOrError = Fruit.create(
			{ name: props.name, description: props.description },
			props.fruitId.getValue(),
		);
		if (fruitOrError.isFailure) {
			return Result.fail(fruitOrError.getErrorValue().toString());
		}

		return Result.ok(fruitOrError.getValue());
	}

	private async _isFruitExist(name: FruitName): Promise<boolean> {
		return await this._fruitRepository.exists(name);
	}

	private async _saveFruit(fruit: Fruit): Promise<void> {
		await this._fruitRepository.saveFruit(fruit);
	}
}
