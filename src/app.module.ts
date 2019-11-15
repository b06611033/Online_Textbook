import {
	Module,
	CacheModule,
	CacheInterceptor,
	ValidationPipe,
	ClassSerializerInterceptor
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { TerminusModule } from "@nestjs/terminus";
import ConfigModule from "./config/config.module";
import TerminusConfigService from "./config/terminus-config.service";
import TypeOrmConfigService from "./config/typeorm-config.service";
import AuthModule from "./auth/auth.module";
import ProductModule from "./product/product.module";
import TransactionModule from "./transaction/transaction.module";
import SubscriptionModule from "./subscription/subscription.module";
import UserModule from "./user/user.module";
import CompanyModule from "./company/company.module";

@Module({
	imports: [
		TerminusModule.forRootAsync({
			imports: [ConfigModule],
			useClass: TerminusConfigService
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useExisting: TypeOrmConfigService
		}),
		CacheModule.register(),
		ConfigModule,
		AuthModule,
		ProductModule,
		TransactionModule,
		SubscriptionModule,
		UserModule,
		CompanyModule
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor
		},
		{
			provide: APP_PIPE,
			useClass: ValidationPipe
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor
		}
	]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class ApplicationModule {}
