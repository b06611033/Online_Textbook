/* eslint-disable import/no-commonjs, import/unambiguous, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */

const path = require("path");

module.exports = {
	type: "mariadb",
	host: process.env.MYMA_STORE_DATABASE_HOST || process.env.TYPEORM_HOST,
	port: process.env.MYMA_STORE_DATABASE_PORT || process.env.TYPEORM_PORT,
	database: process.env.MYMA_STORE_DATABASE || process.env.TYPEORM_DATABASE,
	username: process.env.MYMA_STORE_DATABASE_USERNAME || process.env.TYPEORM_USERNAME,
	password: process.env.MYMA_STORE_DATABASE_PASSWORD || process.env.TYPEORM_PASSWORD,
	synchronize: process.env.NODE_ENV !== "production",
	entities: [
		path.join(
			__dirname,
			process.env.NODE_ENV !== "production" && process.env.MYMA_IN_CONTAINER !== undefined
				? "src"
				: "build",
			"**",
			"*.entity{.ts,.js}"
		)
	],
	subscribers: [
		path.join(
			__dirname,
			process.env.NODE_ENV !== "production" && process.env.MYMA_IN_CONTAINER !== undefined
				? "src"
				: "build",
			"**",
			"*.subscriber{.ts,.js}"
		)
	],
	migrationsRun: true,
	migrationsTableName: "migration",
	migrations: [
		path.join(
			__dirname,
			process.env.NODE_ENV !== "production" && process.env.MYMA_IN_CONTAINER !== undefined
				? "src"
				: "build",
			"migration",
			"*{.ts,.js}"
		)
	],
	cli: {
		migrationDir: path.join(
			process.env.NODE_ENV !== "production" && process.env.MYMA_IN_CONTAINER !== undefined
				? "src"
				: "build",
			"migration"
		)
	}
};
