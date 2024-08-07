import type { FruitModel } from "../../../../shared/infrastructure/database/mongoose/models/Fruit";
import type { Fruit } from "../../domain/fruit";
import type { FruitAmount } from "../../domain/fruitAmount";
import type { FruitDescription } from "../../domain/fruitDescription";
import type { FruitName } from "../../domain/fruitName";
import { FruitMapper } from "../../mappers/fruitMapper";
import type { IFruitRepository } from "../IFruitRepository";

export class FruitRepository implements IFruitRepository {
	private _models: typeof FruitModel;

	constructor(models: typeof FruitModel) {
		this._models = models;
	}

	async exists(name: FruitName): Promise<boolean> {
		const fruit = await this._models.findOne({ name: name.value }).lean();

		return !!fruit;
	}

	async saveFruit(fruit: Fruit): Promise<void> {
		const rawMongooseFruit = FruitMapper.toPersistence(fruit);
		await this._models.create(rawMongooseFruit);
	}

	async deleteFruitByName(name: FruitName): Promise<Fruit> {
		const fruit = await this._models.findOneAndDelete({ name: name.value }).lean();

		return FruitMapper.toDomain(fruit);
	}

	async updateFruit(name: FruitName, description: FruitDescription): Promise<Fruit> {
		const fruit = await this._models
			.findOneAndUpdate({ name: name.value }, { description: description.value }, { new: true })
			.lean();

		return FruitMapper.toDomain(fruit);
	}

	async getFruitByName(name: FruitName): Promise<Fruit> {
		const fruit = await this._models.findOne({ name: name.value }).lean();

		return FruitMapper.toDomain(fruit);
	}

	async storeAmountByName(name: FruitName, amount: FruitAmount): Promise<Fruit> {
		const fruit = await this._models
			.findOneAndUpdate(
				{ name: name.value },
				{
					$inc: {
						amount: amount.value,
					},
				},
				{ new: true },
			)
			.lean();

		return FruitMapper.toDomain(fruit);
	}

	async removeAmountByName(name: FruitName, amount: FruitAmount): Promise<Fruit> {
		const fruit = await this._models
			.findOneAndUpdate(
				{ name: name.value },
				{
					$inc: {
						amount: -amount.value,
					},
				},
				{ new: true },
			)
			.lean();

		return FruitMapper.toDomain(fruit);
	}
}
