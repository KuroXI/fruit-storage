import type { Fruit } from "../domain/fruit";
import type { FruitDescription } from "../domain/fruitDescription";
import type { FruitName } from "../domain/fruitName";

export interface IFruitRepository {
	exists(name: FruitName): Promise<boolean>;
	save(fruit: Fruit): Promise<void>;
	deleteByName(name: FruitName): Promise<Fruit>;
	update(name: FruitName, description: FruitDescription): Promise<Fruit>;
	getFruitByName(name: FruitName): Promise<Fruit>;
}
