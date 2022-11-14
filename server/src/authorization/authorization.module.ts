import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import JwtConfigService from "../server-config/jwt-config.service";
import ServerConfigModule from "../server-config/server-config.module";
import MYMAConfigService from "../server-config/myma-config.service";
import ProductAuthorizationMiddleware from "./middleware/product-authorization.middleware";
import PermissionRepository from "./permission.repository";
import RoleRepository from "./role.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";
import RoleService from "./role.service";
import PermissionService from "./permission.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Role, Permission, RoleRepository, PermissionRepository]),
		JwtModule.registerAsync({ useExisting: JwtConfigService, imports: [ServerConfigModule] }),
		ServerConfigModule
	],
	exports: [PermissionRepository, RoleRepository],
	providers: [
		ProductAuthorizationMiddleware,
		PermissionRepository,
		RoleRepository,
		RoleService,
		PermissionService
	]
})
export default class AuthorizationModule implements NestModule {
	public constructor(private readonly mymaConfigService: MYMAConfigService) {}

	public configure(consumer: MiddlewareConsumer): void {
		consumer
			.apply(ProductAuthorizationMiddleware)
			.forRoutes(`${this.mymaConfigService.mymaContentRootRoute}/*`);
	}
}
