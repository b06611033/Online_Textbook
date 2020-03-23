/* eslint-disable import/no-commonjs, import/unambiguous, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */

const path = require("path");

const migrationDir = path.join(__dirname, "src", "migration");

module.exports = {
	type: "mariadb",
	host: process.env.MYMA_STORE_DATABASE_HOST || process.env.TYPEORM_HOST,
	port: process.env.MYMA_STORE_DATABASE_PORT || process.env.TYPEORM_PORT,
	database: process.env.MYMA_STORE_DATABASE || process.env.TYPEORM_DATABASE,
	username: process.env.MYMA_STORE_DATABASE_USERNAME || process.env.TYPEORM_USERNAME,
	password: process.env.MYMA_STORE_DATABASE_PASSWORD || process.env.TYPEORM_PASSWORD,
	synchronize: process.env.NODE_ENV !== "production",
	entities: [path.join(__dirname, "src", "**", "*.entity{.ts,.js}")],
	subscribers: [path.join(__dirname, "src", "**", "*.subscriber{.ts,.js}")],
	migrationsRun: true,
	migrationsTableName: "migration",
	migrations: [path.join(migrationDir, "*{.ts, .js}")],
	cli: {
		migrationDir
	}
};
