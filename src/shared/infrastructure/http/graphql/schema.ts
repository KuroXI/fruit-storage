import path from "node:path";
import { makeSchema, objectType } from "nexus";
import { mutation } from "./mutation";
import { query } from "./query";

const fruit = objectType({
	name: "Fruit",
	definition: (type) => {
		type.id("id");
		type.string("name");
		type.string("description");
		type.int("amount");
	},
});

export const returnQuery = objectType({
	name: "ReturnQuery",
	definition: (type) => {
		type.id("id");
		type.int("limit");
		type.field("fruit", { type: fruit });
	},
});

const schema = makeSchema({
	types: [fruit, returnQuery, mutation, query],
	outputs: {
		schema: path.join(__dirname, "/nexus/schema.graphql"),
		typegen: path.join(__dirname, "/nexus/types.ts"),
	},
});

export default schema;
