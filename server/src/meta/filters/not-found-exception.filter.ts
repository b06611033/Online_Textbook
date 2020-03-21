import { ServerResponse, IncomingMessage } from "http";
import { Catch, NotFoundException, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Response, Request } from "express";
import { isSome } from "fp-ts/lib/Option";
import EnvConfigService from "../../server-config/env-config.service";

@Catch(NotFoundException)
export default class NotFoundExceptionFilter implements ExceptionFilter {
	public constructor(private readonly envConfigService: EnvConfigService) {}

	public catch(exception: NotFoundException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse<
			ServerResponse & Response<{ statusCode: number; message: string }>
		>();
		const req = ctx.getRequest<IncomingMessage & Request>();
		const status = exception.getStatus();

		const notFoundRoute = this.envConfigService.mymaNotFoundRoute;

		if (
			isSome(notFoundRoute) &&
			req.baseUrl.startsWith(this.envConfigService.mymaContentRootRoute)
		) {
			res.redirect(notFoundRoute.value);
		} else {
			res
				.json({
					statusCode: status,
					message: exception.message
				})
				.status(status);
		}
	}
}
