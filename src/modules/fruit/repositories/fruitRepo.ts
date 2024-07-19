import type { Fruit } from "../domain/fruit";
import type { FruitDescription } from "../domain/fruitDescription";
import type { FruitName } from "../domain/fruitName";

export interface IFruitRepo {
	exists(name: FruitName): Promise<boolean>;
	save(fruit: Fruit): Promise<void>;
	delete(name: FruitName): Promise<Fruit>;
	update(name: FruitName, description: FruitDescription): Promise<Fruit>;
	getFruit(name: FruitName): Promise<Fruit>;
}
