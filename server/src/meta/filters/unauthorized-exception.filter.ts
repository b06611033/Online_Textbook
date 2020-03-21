import { ServerResponse, IncomingMessage } from "http";
import {
	Catch,
	ExceptionFilter,
	ArgumentsHost,
	UnauthorizedException,
	Logger,
	HttpStatus
} from "@nestjs/common";
import { Response, Request } from "express";
import { isSome } from "fp-ts/lib/Option";
import EnvConfigService from "../../server-config/env-config.service";

@Catch(UnauthorizedException)
export default class UnauthorizedExceptionFilter implements ExceptionFilter {
	private static readonly logger = new Logger(UnauthorizedException.name);

	public constructor(private readonly envConfigService: EnvConfigService) {}

	public catch(exception: UnauthorizedException, host: ArgumentsHost): void {
		UnauthorizedExceptionFilter.logger.debug("Caught UnauthorizedException");

		const ctx = host.switchToHttp();
		const res = ctx.getResponse<ServerResponse & Response>();
		const req = ctx.getRequest<IncomingMessage & Request>();
		const status = exception.getStatus();

		const unauthorizedRoute = this.envConfigService.mymaUnauthorizedRoute;

		if (
			isSome(unauthorizedRoute) &&
			req.baseUrl.startsWith(this.envConfigService.mymaContentRootRoute)
		) {
			UnauthorizedExceptionFilter.logger.debug(
				`${req.baseUrl} ${this.envConfigService.mymaContentRootRoute}`
			);
			res.redirect(unauthorizedRoute.value);
		} else {
			res
				.send({
					statusCode: exception.getStatus(),
					message: exception.message
				})
				.status(exception.getStatus());
		}
	}
}
