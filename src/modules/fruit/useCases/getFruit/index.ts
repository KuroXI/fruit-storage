import { fruitRepository } from "../../repositories";
import { GetFruit } from "./getFruit";

const getFruit = new GetFruit(fruitRepository);

export { getFruit };
