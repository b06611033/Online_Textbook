import { Module } from "@nestjs/common";
import LoggerMiddleware from "./logger.middleware";

@Module({
	providers: [LoggerMiddleware]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class MiddlewareModule {}
