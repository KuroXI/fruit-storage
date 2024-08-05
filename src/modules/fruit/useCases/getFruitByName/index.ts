import { fruitRepository } from "../../repositories";
import { GetFruitByName } from "./getFruitByName";
import { GetFruitByNameController } from "./getFruitByNameController";

const getFruitByNameUseCase = new GetFruitByName(fruitRepository);
const getFruitByNameController = new GetFruitByNameController(getFruitByNameUseCase);

export { getFruitByNameUseCase, getFruitByNameController };
