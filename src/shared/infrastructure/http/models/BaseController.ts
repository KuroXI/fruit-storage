import { ApolloError } from "apollo-server";

export abstract class BaseController<IRequest, IResponse> {
	abstract executeImpl(request: IRequest): Promise<IResponse>;

	public conflict(message: string) {
		throw new ApolloError(message, "CONFLICT");
	}

	public badRequest(message: string) {
		throw new ApolloError(message, "BAD_REQUEST");
	}

	public notFound(message: string) {
		throw new ApolloError(message, "NOT_FOUND");
	}
}
