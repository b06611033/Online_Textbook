import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import JwtConfigService from "../server-config/jwt-config.service";
import ServerConfigModule from "../server-config/server-config.module";
import ProductAuthorizationMiddleware from "./middleware/product-authorization.middleware";

@Module({
	imports: [
		JwtModule.registerAsync({ useExisting: JwtConfigService, imports: [ServerConfigModule] })
	],
	providers: [ProductAuthorizationMiddleware]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class AuthorizationModule implements NestModule {
	// eslint-disable-next-line class-methods-use-this
	public configure(consumer: MiddlewareConsumer): void {
		consumer.apply(ProductAuthorizationMiddleware).forRoutes("/content/MYMACalculus/*");
	}
}
