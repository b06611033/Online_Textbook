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
import MYMAConfigService from "./myma-config.service";

@Injectable()
export default class TerminusConfigService implements TerminusOptionsFactory {
	private static readonly logger = new Logger(TerminusConfigService.name);

	public constructor(
		private readonly typeOrm: TypeOrmHealthIndicator,
		private readonly memory: MemoryHealthIndicator,
		private readonly disk: DiskHealthIndicator,
		private readonly mymaConfigService: MYMAConfigService
	) {}

	public createTerminusOptions(): TerminusModuleOptions {
		TerminusConfigService.logger.log("Creating Terminus options");

		const diskThresholdPercentage = this.mymaConfigService.diskThresholdPercentage;
		const memoryHeapThreshold = this.mymaConfigService.memoryHeapThreshold;
		const memoryRssThreshold = this.mymaConfigService.memoryRssThreshold;

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
			url: "/api/admin/server/health",
			healthIndicators
		};

		return {
			endpoints: [healthEndpoint]
		};
	}
}
