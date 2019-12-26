import { join } from "path";
import { Injectable, Logger } from "@nestjs/common";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
import EnvConfigService from "./env-config.service";

@Injectable()
export default class TypeOrmConfigService implements TypeOrmOptionsFactory {
	private static readonly logger = new Logger(TypeOrmConfigService.name);
	private static readonly migrationsDir = join(__dirname, "..", "migrations");

	public constructor(private readonly envConfigService: EnvConfigService) {}

	public createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
		TypeOrmConfigService.logger.log("Creating database options");
		TypeOrmConfigService.logger.log(
			`Migrations located in "${TypeOrmConfigService.migrationsDir}"`
		);

		return {
			type: "mariadb",
			host: this.envConfigService.mymaStoreDatabaseHost,
			port: this.envConfigService.mymaStoreDatabasePort,
			username: this.envConfigService.mymaStoreDatabaseUsername,
			password: this.envConfigService.mymaStoreDatabasePassword,
			database: this.envConfigService.mymaStoreDatabase,
			entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
			synchronize: this.envConfigService.nodeEnv !== "production",
			migrationsRun: true,
			migrationsTableName: "migration",
			migrations: [join(TypeOrmConfigService.migrationsDir, "*{.ts,.js}")],
			cli: {
				migrationsDir: TypeOrmConfigService.migrationsDir
			}
		};
	}
}
