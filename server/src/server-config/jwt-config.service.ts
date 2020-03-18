import { Injectable, Logger } from "@nestjs/common";
import { JwtOptionsFactory, JwtModuleOptions } from "@nestjs/jwt";
import EnvConfigService from "./env-config.service";

@Injectable()
export default class JwtConfigService implements JwtOptionsFactory {
	private static readonly logger = new Logger(JwtConfigService.name);

	public constructor(private readonly envConfigService: EnvConfigService) {}

	public createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
		JwtConfigService.logger.log("Creating JWT options");

		return {
			secret: this.envConfigService.jwtSecret,
			signOptions: {
				audience: ["https://mymathapps.com", "http://localhost:3000"]
			}
		};
	}
}
