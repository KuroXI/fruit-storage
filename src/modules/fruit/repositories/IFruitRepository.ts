import type { Fruit } from "../domain/fruit";
import type { FruitDescription } from "../domain/fruitDescription";
import type { FruitName } from "../domain/fruitName";

export interface IFruitRepository {
	exists(name: FruitName): Promise<boolean>;
	saveFruit(fruit: Fruit): Promise<void>;
	deleteFruitByName(name: FruitName): Promise<Fruit>;
	updateFruit(name: FruitName, description: FruitDescription): Promise<Fruit>;
	getFruitByName(name: FruitName): Promise<Fruit>;
}
