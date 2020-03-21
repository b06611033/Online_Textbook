import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import JwtConfigService from "../server-config/jwt-config.service";
import ServerConfigModule from "../server-config/server-config.module";
import EnvConfigService from "../server-config/env-config.service";
import ProductAuthorizationMiddleware from "./middleware/product-authorization.middleware";

@Module({
	imports: [
		JwtModule.registerAsync({ useExisting: JwtConfigService, imports: [ServerConfigModule] }),
		ServerConfigModule
	],
	providers: [ProductAuthorizationMiddleware]
})
export default class AuthorizationModule implements NestModule {
	public constructor(private readonly envConfigService: EnvConfigService) {}

	public configure(consumer: MiddlewareConsumer): void {
		consumer
			.apply(ProductAuthorizationMiddleware)
			.forRoutes(`${this.envConfigService.mymaContentRootRoute}/*`);
	}
}
