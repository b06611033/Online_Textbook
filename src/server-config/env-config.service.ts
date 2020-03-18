import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export default class EnvConfigService {
	public constructor(private configService: ConfigService) {}

	public get nodeEnv(): "development" | "production" | "testing" {
		const nodeEnv = String(this.configService.get("NODE_ENV"));

		switch (nodeEnv) {
			case "development":
				return "development";
			case "production":
				return "production";
			case "testing":
				return "testing";
			default:
				throw new Error(`Unknown NODE_ENV: ${nodeEnv}`);
		}
	}

	public get mymaStoreDatabaseHost(): string {
		return String(this.configService.get("MYMA_STORE_DATABASE_HOST"));
	}

	public get mymaStoreDatabasePort(): number {
		return Number(this.configService.get("MYMA_STORE_DATABASE_PORT"));
	}

	public get mymaStoreDatabaseUsername(): string {
		return String(this.configService.get("MYMA_STORE_DATABASE_USERNAME"));
	}

	public get mymaStoreDatabasePassword(): string {
		return String(this.configService.get("MYMA_STORE_DATABASE_PASSWORD"));
	}

	public get mymaStoreDatabase(): string {
		return String(this.configService.get("MYMA_STORE_DATABASE"));
	}

	public get mymaStoreDomain(): string {
		return String(this.configService.get("MYMA_STORE_DOMAIN"));
	}

	public get googleOAuthClientId(): string {
		return String(this.configService.get("GOOGLE_OAUTH_CLIENT_ID"));
	}

	public get googleOAuthClientSecret(): string {
		return String(this.configService.get("GOOGLE_OAUTH_CLIENT_SECRET"));
	}

	public get googleOAuthCallback(): string {
		return String(this.configService.get("GOOGLE_OAUTH_CALLBACK"));
	}

	public get jwtSecret(): string {
		return String(this.configService.get("JWT_SECRET"));
	}

	public get productsPath(): string | undefined {
		const path = this.configService.get("PRODUCTS_PATH");

		return path === undefined ? undefined : String(path);
	}

	public get diskThresholdPercentage(): number | undefined {
		const percentage = this.configService.get("DISK_THRESHOLD_PERCENTAGE");

		return percentage === undefined ? undefined : Number(percentage);
	}

	public get memoryRssThreshold(): number | undefined {
		const threshold = this.configService.get("MEMORY_RSS_THRESHOLD");

		return threshold === undefined ? undefined : Number(threshold);
	}

	public get memoryHeapThreshold(): number | undefined {
		const threshold = this.configService.get("MEMORY_HEAP_THRESHOLD");

		return threshold === undefined ? undefined : Number(threshold);
	}
}
