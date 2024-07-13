import { models } from "../../../../shared/infrastructure/database/mongoose/models";
import { FruitRepository } from "./mongoose/fruitRepository";

const fruitRepository = new FruitRepository(models.fruit);

export { fruitRepository };
