import { fruitRepository } from "../../repositories/implementations";
import { GetFruit } from "./getFruit";

const getFruit = new GetFruit(fruitRepository);

export { getFruit };
