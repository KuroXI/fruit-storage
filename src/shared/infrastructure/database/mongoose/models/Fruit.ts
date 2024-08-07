import mongoose, { Schema, type Types } from "mongoose";

export interface IFruit {
	id: Types.ObjectId;
	name: string;
	description: string;
}

const FruitSchema = new Schema({
	id: {
		type: Schema.Types.ObjectId,
		index: {
			required: true,
		},
	},
	name: {
		type: String,
		index: {
			required: true,
			unique: true,
		},
	},
	description: {
		type: String,
		index: {
			required: true,
		},
	},
	amount: { type: Number },
});

export const FruitModel = mongoose.model<IFruit>("Fruit", FruitSchema);
