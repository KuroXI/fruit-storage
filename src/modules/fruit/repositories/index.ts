import { models } from "../../../shared/infrastructure/database/mongoose/models";
import { FruitRepository } from "./implementations/fruitRepository";

const fruitRepository = new FruitRepository(models.fruit);

export { fruitRepository };
