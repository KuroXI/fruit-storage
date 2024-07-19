import { AppError } from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import type { UseCase } from "../../../../shared/core/UseCase";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Fruit } from "../../domain/fruit";
import { FruitDescription } from "../../domain/fruitDescription";
import { FruitId } from "../../domain/fruitId";
import { FruitName } from "../../domain/fruitName";
import type { IFruitRepo } from "../../repositories/fruitRepo";
import type { CreateFruitDTO } from "./createFruitDTO";
import { CreateFruitErrors } from "./createFruitErrors";
import { CreateFruitOutbox } from "./createFruitOutbox";
import type { CreateFruitResponse } from "./createFruitResponse";

export class CreateFruit implements UseCase<CreateFruitDTO, CreateFruitResponse> {
	private _fruitRepository: IFruitRepo;

	constructor(fruitRepository: IFruitRepo) {
		this._fruitRepository = fruitRepository;
	}

	public async execute(request: CreateFruitDTO): Promise<CreateFruitResponse> {
		try {
			const fruitIdOrError = FruitId.create(new UniqueEntityID());
			const fruitNameOrError = FruitName.create({ value: request.name });
			const fruitDescriptionOrError = FruitDescription.create({
				value: request.description,
			});

			const fruitCombineResult = Result.combine([
				fruitIdOrError,
				fruitNameOrError,
				fruitDescriptionOrError,
			]);
			if (fruitCombineResult.isFailure) {
				return left(Result.fail(fruitCombineResult.getErrorValue()));
			}

			const fruitId = fruitIdOrError.getValue();
			const fruitName = fruitNameOrError.getValue();
			const fruitDescription = fruitDescriptionOrError.getValue();

			const fruitAlreadyExists = await this._fruitRepository.exists(fruitName);
			if (fruitAlreadyExists) {
				return left(
					Result.fail(
						new CreateFruitErrors.FruitAlreadyExistError(fruitName.props.value).getErrorValue()
							.message,
					),
				);
			}

			const fruit = Fruit.create(
				{
					name: fruitName,
					description: fruitDescription,
				},
				fruitId.getValue(),
			);

			await this._fruitRepository.save(fruit.getValue());

			CreateFruitOutbox.emit(fruit.getValue());

			return right(Result.ok<Fruit>(fruit.getValue()));
		} catch (error) {
			return left(new AppError.UnexpectedError(error));
		}
	}
}
