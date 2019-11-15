import fs from "fs";
import { Injectable } from "@nestjs/common";
import dotenv from "dotenv";
import Joi from "@hapi/joi";

interface EnvConfig {
	[key: string]: string;
}

@Injectable()
export default class ConfigService {
	private readonly envConfig: EnvConfig;

	public constructor(path: string) {
		const config = dotenv.parse(fs.readFileSync(path));
		this.envConfig = ConfigService.validate(config);
	}

	private static validate(envConfig: EnvConfig): EnvConfig {
		const envVarsSchema = Joi.object({
			NODE_ENV: Joi.string()
				.valid(["development", "production", "testing"])
				.default("development"),
			MYMA_STORE_DATABASE_HOST: Joi.string()
				.hostname()
				.default("localhost")
				.description("Host the database listens on"),
			MYMA_STORE_DATABASE_PORT: Joi.number()
				.default(3306)
				.description("Port the database listens on"),
			MYMA_STORE_DATABASE_USERNAME: Joi.string()
				.default("root")
				.description("Username for the database user"),
			MYMA_STORE_DATABASE_PASSWORD: Joi.string().default(
				"yasskin",
				"Password for the database user"
			),
			MYMA_STORE_DATABASE: Joi.string().default("MYMAStore", "Name of the database to use"),
			GOOGLE_OAUTH_CLIENT_ID: Joi.string()
				.required()
				.description("Google OAuth Client ID"),
			GOOGLE_OAUTH_CLIENT_SECRET: Joi.string()
				.required()
				.description("Google OAuth Client Secret"),
			GOOGLE_OAUTH_CALLBACK: Joi.string()
				.required()
				.description("Where Google should redirect to after login"),
			JWT_SECRET: Joi.string()
				.required()
				.description("The JWT secret to sign all tokens with"),
			PRODUCTS_PATH: Joi.string().description("Root path of where products are located on disk"),
			DISK_THRESHOLD_PERCENTAGE: Joi.number().description("Disk usage percentage to warn at"),
			MEMORY_HEAP_THRESHOLD: Joi.number().description("Heap usage percentage to warn at"),
			MEMORY_RSS_THRESHOLD: Joi.number().description(
				"Resident set size usage percentage to warn at"
			),
			MYMA_STORE_DOMAIN: Joi.string()
				.default("localhost")
				.description(
					"Domain of the website Needed in order to share user JWT for subscription validation and OAuth2 redirect."
				)
		});

		const { error, value } = Joi.validate(envConfig, envVarsSchema);
		if (error) {
			throw new Error(`Config validation error: ${error.message}`);
		}

		return value;
	}

	public get nodeEnv(): "development" | "production" | "testing" | string {
		return String(this.envConfig.NODE_ENV);
	}

	public get mymaStoreDatabaseHost(): string {
		return String(this.envConfig.MYMA_STORE_DATABASE_HOST);
	}

	public get mymaStoreDatabasePort(): number {
		return Number(this.envConfig.MYMA_STORE_DATABASE_PORT);
	}

	public get mymaStoreDatabaseUsername(): string {
		return String(this.envConfig.MYMA_STORE_DATABASE_USERNAME);
	}

	public get mymaStoreDatabasePassword(): string {
		return String(this.envConfig.MYMA_STORE_DATABASE_PASSWORD);
	}

	public get mymaStoreDatabase(): string {
		return String(this.envConfig.MYMA_STORE_DATABASE);
	}

	public get googleOAuthClientId(): string {
		return String(this.envConfig.GOOGLE_OAUTH_CLIENT_ID);
	}

	public get googleOAuthClientSecret(): string {
		return String(this.envConfig.GOOGLE_OAUTH_CLIENT_SECRET);
	}

	public get googleOAuthCallback(): string {
		return String(this.envConfig.GOOGLE_OAUTH_CALLBACK);
	}

	public get jwtSecret(): string {
		return String(this.envConfig.JWT_SECRET);
	}

	public get productsPath(): string | undefined {
		return this.envConfig.PRODUCTS_PATH === undefined
			? undefined
			: String(this.envConfig.PRODUCTS_PATH);
	}

	public get diskThresholdPercentage(): number | undefined {
		return this.envConfig.DISK_THRESHOLD_PERCENTAGE === undefined
			? undefined
			: Number(this.envConfig.DISK_THRESHOLD_PERCENTAGE);
	}

	public get memoryRssThreshold(): number | undefined {
		return this.envConfig.MEMORY_RSS_THRESHOLD === undefined
			? undefined
			: Number(this.envConfig.MEMORY_RSS_THRESHOLD);
	}

	public get memoryHeapThreshold(): number | undefined {
		return this.envConfig.MEMORY_HEAP_THRESHOLD === undefined
			? undefined
			: Number(this.envConfig.MEMORY_HEAP_THRESHOLD);
	}

	public get stripeApiKey(): string {
		return String(this.envConfig.STRIPE_API_KEY);
	}

	public get mymaStoreDomain(): string {
		return String(this.envConfig.MYMA_STORE_DOMAIN);
	}
}
