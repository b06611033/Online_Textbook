import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import JwtConfigService from "../server-config/jwt-config.service";
import ServerConfigModule from "../server-config/server-config.module";

@Module({
	imports: [
		JwtModule.registerAsync({ useExisting: JwtConfigService, imports: [ServerConfigModule] })
	]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class AuthorizationModule {}
