import {
	TerminusOptionsFactory,
	TypeOrmHealthIndicator,
	MemoryHealthIndicator,
	DiskHealthIndicator,
	TerminusModuleOptions,
	TerminusEndpoint
} from "@nestjs/terminus";
import { Injectable, Logger } from "@nestjs/common";
import ConfigService from "./config.service";

@Injectable()
export default class TerminusConfigService implements TerminusOptionsFactory {
	private static readonly logger = new Logger(TerminusConfigService.name);

	public constructor(
		private readonly typeOrm: TypeOrmHealthIndicator,
		private readonly memory: MemoryHealthIndicator,
		private readonly disk: DiskHealthIndicator,
		private readonly configService: ConfigService
	) {}

	public createTerminusOptions(): TerminusModuleOptions {
		TerminusConfigService.logger.log("Creating Terminus options");

		let healthIndicators = [async () => this.typeOrm.pingCheck("database")];

		if (this.configService.diskThresholdPercentage !== undefined) {
			healthIndicators.push(async () =>
				this.disk.checkStorage("disk_storage", {
					thresholdPercent: this.configService.diskThresholdPercentage!,
					path: "/"
				})
			);
		}

		if (this.configService.memoryHeapThreshold !== undefined) {
			healthIndicators.push(async () =>
				this.memory.checkHeap("memory_heap", this.configService.memoryHeapThreshold!)
			);
		}

		if (this.configService.memoryRssThreshold !== undefined) {
			healthIndicators.push(async () =>
				this.memory.checkHeap("memory_rss", this.configService.memoryRssThreshold!)
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
