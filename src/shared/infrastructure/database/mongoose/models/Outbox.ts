import mongoose, { type Document, Schema, type Types } from "mongoose";

interface IOutbox extends Document {
	id: Types.ObjectId;
	eventName: string;
	payload: string;
	processed: boolean;
	createdAt: Date;
}

const OutboxSchema = new Schema({
	id: {
		type: Schema.Types.ObjectId,
		index: {
			required: true,
		},
	},
	eventName: {
		type: String,
		index: {
			required: true,
		},
	},
	payload: {
		type: String,
		index: {
			required: true,
		},
	},
	processed: {
		type: Boolean,
		index: {
			default: false,
			required: true,
		},
	},
	createdAt: {
		type: Date,
		index: {
			default: Date.now(),
		},
	},
});

export const OutboxModel = mongoose.model<IOutbox>("Outbox", OutboxSchema);
