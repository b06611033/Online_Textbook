import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { ConfigModule } from "@nestjs/config";
import TypeOrmConfigService from "./typeorm-config.service";
import TerminusConfigService from "./terminus-config.service";
import JwtConfigService from "./jwt-config.service";
import EnvConfigService from "./env-config.service";

@Module({
	imports: [TerminusModule, ConfigModule],
	providers: [EnvConfigService, TypeOrmConfigService, TerminusConfigService, JwtConfigService],
	exports: [EnvConfigService, TypeOrmConfigService, TerminusConfigService, JwtConfigService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class ServerConfigModule {}
