import { type ClientSession, startSession } from "mongoose";
import type { IUnitOfWork } from "../IUnitOfWork";

export class UnitOfWork implements IUnitOfWork {
	private _session?: ClientSession;

	async startTransaction(): Promise<void> {
		this._session = await startSession();
		this._session?.startTransaction();
	}

	async commitTransaction(): Promise<void> {
		if (this._session) {
			await this._session.commitTransaction();
		}
	}

	async abortTransaction(): Promise<void> {
		if (this._session) {
			await this._session.abortTransaction();
		}
	}

	async endTransaction(): Promise<void> {
		this._session?.endSession();
	}
}
