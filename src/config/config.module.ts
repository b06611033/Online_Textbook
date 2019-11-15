import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import ConfigService from "./config.service";
import TypeOrmConfigService from "./typeorm-config.service";
import TerminusConfigService from "./terminus-config.service";
import JwtConfigService from "./jwt-config.service";

@Module({
	imports: [TerminusModule],
	providers: [
		{
			provide: ConfigService,
			useValue: new ConfigService(`${process.env.NODE_ENV}.env`)
		},
		TypeOrmConfigService,
		TerminusConfigService,
		JwtConfigService
	],
	exports: [ConfigService, TypeOrmConfigService, TerminusConfigService, JwtConfigService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class ConfigModule {}
