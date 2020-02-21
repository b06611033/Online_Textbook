import {
	TerminusOptionsFactory,
	TypeOrmHealthIndicator,
	MemoryHealthIndicator,
	DiskHealthIndicator,
	TerminusModuleOptions,
	TerminusEndpoint
} from "@nestjs/terminus";
import { Injectable, Logger } from "@nestjs/common";
import type EnvConfigService from "./env-config.service";

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

		const healthIndicators = [async () => this.typeOrm.pingCheck("database")];

		if (this.envConfigService.diskThresholdPercentage !== undefined) {
			healthIndicators.push(async () =>
				this.disk.checkStorage("disk_storage", {
					thresholdPercent: this.envConfigService.diskThresholdPercentage!,
					path: "/"
				})
			);
		}

		if (this.envConfigService.memoryHeapThreshold !== undefined) {
			healthIndicators.push(async () =>
				this.memory.checkHeap("memory_heap", this.envConfigService.memoryHeapThreshold!)
			);
		}

		if (this.envConfigService.memoryRssThreshold !== undefined) {
			healthIndicators.push(async () =>
				this.memory.checkHeap("memory_rss", this.envConfigService.memoryRssThreshold!)
			);
		}

		const healthEndpoint: TerminusEndpoint = {
			url: "/server/health",
			healthIndicators
		};

		return {
			endpoints: [healthEndpoint]
		};
	}
}
