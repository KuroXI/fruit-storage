import type { FruitModel } from "../../../../shared/infrastructure/database/mongoose/models/Fruit";
import type { Fruit } from "../../domain/fruit";
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

	async save(fruit: Fruit): Promise<void> {
		const exists = await this.exists(fruit.name);

		if (exists) {
			throw new Error("Fruit already exist!");
		}

		const rawMongooseFruit = FruitMapper.toPersistence(fruit);
		await this._models.create(rawMongooseFruit);
	}

	async delete(name: FruitName): Promise<Fruit> {
		const fruit = await this._models.findOneAndDelete({ name: name.value }).lean();

		return FruitMapper.toDomain(fruit);
	}

	async update(name: FruitName, description: FruitDescription): Promise<Fruit> {
		const fruit = await this._models
			.findOneAndUpdate({ name: name.value }, { description: description.value }, { new: true })
			.lean();

		return FruitMapper.toDomain(fruit);
	}

	async getFruit(name: FruitName): Promise<Fruit> {
		const fruit = await this._models.findOne({ name: name.value }).lean();

		return FruitMapper.toDomain(fruit);
	}
}
