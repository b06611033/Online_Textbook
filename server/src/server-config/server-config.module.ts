import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { ConfigModule } from "@nestjs/config";
import TerminusConfigService from "./terminus-config.service";
import JwtConfigService from "./jwt-config.service";
import MYMAConfigService from "./myma-config.service";

@Module({
	imports: [TerminusModule, ConfigModule],
	providers: [MYMAConfigService, TerminusConfigService, JwtConfigService],
	exports: [MYMAConfigService, TerminusConfigService, JwtConfigService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class ServerConfigModule {}
