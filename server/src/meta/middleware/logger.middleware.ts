import { IncomingMessage, ServerResponse } from "http";
import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export default class LoggerMiddleware
	implements NestMiddleware<IncomingMessage & Request, ServerResponse & Response> {
	private static readonly logger = new Logger(LoggerMiddleware.name);

	// eslint-disable-next-line class-methods-use-this
	public use(req: IncomingMessage & Request, res: ServerResponse & Response, next: Function): void {
		Logger.debug(`Incoming request: ${req.baseUrl}`);
		next();
	}
}
