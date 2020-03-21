import {
	TerminusOptionsFactory,
	TypeOrmHealthIndicator,
	MemoryHealthIndicator,
	DiskHealthIndicator,
	TerminusModuleOptions,
	TerminusEndpoint
} from "@nestjs/terminus";
import { Injectable, Logger } from "@nestjs/common";
import { isSome } from "fp-ts/lib/Option";
import EnvConfigService from "./env-config.service";

@Injectable()
export default class TerminusConfigService implements TerminusOptionsFactory {
	private static readonly logger = new Logger(TerminusConfigService.name);

	public constructor(
		private readonly typeOrm: TypeOrmHealthIndicator,
		private readonly memory: MemoryHealthIndicator,
		private readonly disk: DiskHealthIndicator,
		private readonly envConfigService: EnvConfigService
	) {}

	public createTerminusOptions(): TerminusModuleOptions {
		TerminusConfigService.logger.log("Creating Terminus options");

		const diskThresholdPercentage = this.envConfigService.diskThresholdPercentage;
		const memoryHeapThreshold = this.envConfigService.memoryHeapThreshold;
		const memoryRssThreshold = this.envConfigService.memoryRssThreshold;

		const healthIndicators = [async () => this.typeOrm.pingCheck("database")];

		if (isSome(diskThresholdPercentage)) {
			TerminusConfigService.logger.log(
				`Configured disk threshold percentage: ${diskThresholdPercentage.value}`
			);
			healthIndicators.push(async () =>
				this.disk.checkStorage("disk_storage", {
					thresholdPercent: diskThresholdPercentage.value,
					path: "/"
				})
			);
		}

		if (isSome(memoryHeapThreshold)) {
			TerminusConfigService.logger.log(`Configured heap threshold: ${memoryHeapThreshold.value}`);
			healthIndicators.push(async () =>
				this.memory.checkHeap("memory_heap", memoryHeapThreshold.value)
			);
		}

		if (isSome(memoryRssThreshold)) {
			TerminusConfigService.logger.log(`Configured memory RSS threshold: ${memoryRssThreshold}`);
			healthIndicators.push(async () =>
				this.memory.checkHeap("memory_rss", memoryRssThreshold.value)
			);
		}

		const healthEndpoint: TerminusEndpoint = {
			url: "/admin/server/health",
			healthIndicators
		};

		return {
			endpoints: [healthEndpoint]
		};
	}
}
