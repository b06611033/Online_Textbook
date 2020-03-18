import fs from "fs";
import { Injectable, Logger } from "@nestjs/common";
import { ServeStaticModuleOptionsFactory, ServeStaticModuleOptions } from "@nestjs/serve-static";
import EnvConfigService from "./env-config.service";

@Injectable()
export default class ServeStaticConfigService implements ServeStaticModuleOptionsFactory {
	private static readonly logger = new Logger(ServeStaticConfigService.name);

	public constructor(private readonly envConfigService: EnvConfigService) {}

	public createLoggerOptions(): ServeStaticModuleOptions[] {
		ServeStaticConfigService.logger.log("Creating ServeStatic options");

		if (!fs.existsSync(this.envConfigService.staticSitePath)) {
			if (this.envConfigService.nodeEnv === "production") {
				ServeStaticConfigService.logger.error(
					`${this.envConfigService.staticSitePath} does not exist`
				);
			} else {
				ServeStaticConfigService.logger.warn(
					`${this.envConfigService.staticSitePath} does not exist`
				);
			}
		}

		return [
			{
				rootPath: this.envConfigService.staticSitePath,
				exclude: ["/api/*"]
			}
		] as ServeStaticModuleOptions[];
	}
}
