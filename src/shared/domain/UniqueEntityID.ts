import { Types } from "mongoose";
import { Identifier } from "./Identifier";

export class UniqueEntityID extends Identifier<string | number> {
	constructor(id?: string | number) {
		super(id?.toString() ?? new Types.ObjectId().toHexString());
	}
}
