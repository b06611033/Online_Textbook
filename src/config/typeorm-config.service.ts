import { join } from "path";
import { Injectable, Logger } from "@nestjs/common";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
import ConfigService from "./config.service";

@Injectable()
export default class TypeOrmConfigService implements TypeOrmOptionsFactory {
	private static readonly logger = new Logger(TypeOrmConfigService.name);
	private static readonly migrationsDir = join(__dirname, "..", "migrations");

	public constructor(private readonly configService: ConfigService) {}

	public createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
		TypeOrmConfigService.logger.log("Creating database options");
		TypeOrmConfigService.logger.log(
			`Migrations located in "${TypeOrmConfigService.migrationsDir}"`
		);

		return {
			type: "mariadb",
			host: this.configService.mymaStoreDatabaseHost,
			port: this.configService.mymaStoreDatabasePort,
			username: this.configService.mymaStoreDatabaseUsername,
			password: this.configService.mymaStoreDatabasePassword,
			database: this.configService.mymaStoreDatabase,
			entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
			synchronize: this.configService.nodeEnv !== "production",
			migrationsRun: true,
			migrationsTableName: "migration",
			migrations: [join(TypeOrmConfigService.migrationsDir, "*{.ts,.js}")],
			cli: {
				migrationsDir: TypeOrmConfigService.migrationsDir
			}
		};
	}
}
