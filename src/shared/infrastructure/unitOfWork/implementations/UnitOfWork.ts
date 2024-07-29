import { type ClientSession, startSession } from "mongoose";
import type { IUnitOfWork } from "../IUnitOfWork";

export class UnitOfWork implements IUnitOfWork {
	private _session?: ClientSession;

	get session(): ClientSession | undefined {
		return this._session;
	}

	async start(): Promise<void> {
		this._session = await startSession();
		this._session?.startTransaction();
	}

	async commit(): Promise<void> {
		if (this._session) {
			await this._session.commitTransaction();
		}
	}

	async abort(): Promise<void> {
		if (this._session) {
			await this._session.abortTransaction();
		}
	}

	async end(): Promise<void> {
		this._session?.endSession();
	}
}
