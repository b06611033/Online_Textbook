import { Injectable, Logger } from "@nestjs/common";
import {
	TypeOrmHealthIndicator,
	HealthIndicatorResult,
	MemoryHealthIndicator,
	DiskHealthIndicator,
	HealthCheckService,
	HealthIndicatorFunction,
	HealthCheckResult
} from "@nestjs/terminus";
import { isSome, Option, some, none } from "fp-ts/lib/Option";
import MYMAConfigService from "../server-config/myma-config.service";
import EmailService from "../email/email.service";

@Injectable()
export default class HealthService {
	private static readonly logger = new Logger(HealthService.name);
	private static readonly healthChecks: HealthIndicatorFunction[] = [];

	public constructor(
		private readonly health: HealthCheckService,
		private readonly typeOrm: TypeOrmHealthIndicator,
		private readonly emailService: EmailService,
		private readonly memory: MemoryHealthIndicator,
		private readonly disk: DiskHealthIndicator,
		private readonly mymaConfigService: MYMAConfigService
	) {}

	private dbCheck(): Promise<HealthIndicatorResult> {
		return this.typeOrm.pingCheck("db");
	}

	private emailServiceCheck(): Promise<HealthIndicatorResult> {
		return Promise.resolve<HealthIndicatorResult>({
			emailService: {
				status: this.emailService.healthy() ? "up" : "down"
			}
		});
	}

	private diskCheck(): Option<Promise<HealthIndicatorResult>> {
		const diskThresholdPercentage = this.mymaConfigService.diskThresholdPercentage;

		if (isSome(diskThresholdPercentage)) {
			HealthService.logger.log(
				`Configured disk threshold percentage: ${diskThresholdPercentage.value}`
			);

			return some(
				this.disk.checkStorage("diskStorage", {
					thresholdPercent: diskThresholdPercentage.value,
					path: "/"
				})
			);
		}

		return none;
	}

	private memoryHeapCheck(): Option<Promise<HealthIndicatorResult>> {
		const memoryHeapThreshold = this.mymaConfigService.memoryHeapThreshold;

		if (isSome(memoryHeapThreshold)) {
			HealthService.logger.log(`Configured memory heap threshold: ${memoryHeapThreshold.value}`);

			return some(this.memory.checkHeap("memoryHeap", memoryHeapThreshold.value));
		}

		return none;
	}

	private memoryRssCheck(): Option<Promise<HealthIndicatorResult>> {
		const memoryRssThreshold = this.mymaConfigService.memoryRssThreshold;

		if (isSome(memoryRssThreshold)) {
			HealthService.logger.log(`Configured memory RSS threshold: ${memoryRssThreshold.value}`);

			return some(this.memory.checkRSS("memoryRss", memoryRssThreshold.value));
		}

		return none;
	}

	public healthy(): Promise<HealthCheckResult> {
		if (HealthService.healthChecks.length === 0) {
			HealthService.healthChecks.push(() => this.dbCheck());
			HealthService.healthChecks.push(() => this.emailServiceCheck());

			const diskCheck = this.diskCheck();
			const memoryHeapCheck = this.memoryHeapCheck();
			const memoryRssCheck = this.memoryRssCheck();

			if (isSome(diskCheck)) {
				HealthService.healthChecks.push(() => diskCheck.value);
			}

			if (isSome(memoryHeapCheck)) {
				HealthService.healthChecks.push(() => memoryHeapCheck.value);
			}

			if (isSome(memoryRssCheck)) {
				HealthService.healthChecks.push(() => memoryRssCheck.value);
			}
		}

		return this.health.check(HealthService.healthChecks);
	}
}
