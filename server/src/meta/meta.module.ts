import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import LoggerMiddleware from "./middleware/logger.middleware";
import NotFoundExceptionFilter from "./filters/not-found-exception.filter";
import UnauthorizedExceptionFilter from "./filters/unauthorized-exception.filter";

@Module({
	providers: []
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class MetaModule {}
