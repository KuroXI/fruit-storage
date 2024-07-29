import { nonNull, queryType, stringArg } from "nexus";
import type { NexusGenRootTypes } from "./nexus/types";
import { findFruitResolver } from "./resolver/findFruit";

const query = queryType({
	definition(type) {
		type.field("findFruit", {
			type: "ReturnQuery",
			args: {
				name: nonNull(stringArg()),
			},
			resolve: async (_, args) =>
				(await findFruitResolver(args)) as NexusGenRootTypes["ReturnQuery"],
		});
	},
});

export { query };
