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

		if (!fs.existsSync(this.envConfigService.mymaStaticSitePath)) {
			if (this.envConfigService.nodeEnv === "production") {
				ServeStaticConfigService.logger.error(
					`${this.envConfigService.mymaStaticSitePath} does not exist`
				);

				process.exit(1);
			} else {
				ServeStaticConfigService.logger.warn(
					`${this.envConfigService.mymaStaticSitePath} does not exist`
				);
			}
		}

		if (!fs.existsSync(this.envConfigService.mymaProductsPath)) {
			if (this.envConfigService.nodeEnv === "production") {
				ServeStaticConfigService.logger.error(
					`${this.envConfigService.mymaProductsPath} does not exist`
				);

				process.exit(1);
			} else {
				ServeStaticConfigService.logger.warn(
					`${this.envConfigService.mymaProductsPath} does not exist`
				);
			}
		}

		return [
			{
				rootPath: this.envConfigService.mymaProductsPath,
				exclude: ["/api/*"],
				serveRoot: "/content/MYMACalculus"
			},
			{
				rootPath: this.envConfigService.mymaStaticSitePath,
				exclude: ["/api/*"]
			}
		] as ServeStaticModuleOptions[];
	}
}
