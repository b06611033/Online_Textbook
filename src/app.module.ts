import {
	Module,
	CacheModule,
	CacheInterceptor,
	ValidationPipe,
	ClassSerializerInterceptor
} from "@nestjs/common";
import Joi from "@hapi/joi";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { TerminusModule } from "@nestjs/terminus";
import { ConfigModule } from "@nestjs/config";
import { NestEmitterModule } from "nest-emitter";
import { EventEmitter } from "typeorm/platform/PlatformTools";
import TerminusConfigService from "./server-config/terminus-config.service";
import TypeOrmConfigService from "./server-config/typeorm-config.service";
import ProductModule from "./product/product.module";
import TransactionModule from "./transaction/transaction.module";
import SubscriptionModule from "./subscription/subscription.module";
import UserModule from "./user/user.module";
import CompanyModule from "./company/company.module";
import ServerConfigModule from "./server-config/server-config.module";
import AuthenticationModule from "./authentication/authentication.module";
import AuthorizationModule from "./authorization/authorization.module";

@Module({
	imports: [
		TerminusModule.forRootAsync({
			imports: [ServerConfigModule],
			useClass: TerminusConfigService
		}),
		TypeOrmModule.forRootAsync({
			imports: [ServerConfigModule],
			useExisting: TypeOrmConfigService
		}),
		ConfigModule.forRoot({
			envFilePath: `${process.env.NODE_ENV}.env`,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					// .valid(["development", "production", "testing"])
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
				MYMA_STORE_DATABASE_PASSWORD: Joi.string()
					.default("yasskin")
					.description("Password for the database user"),
				MYMA_STORE_DATABASE: Joi.string()
					.default("MYMAStore")
					.description("Name of the database to use"),
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
			})
		}),
		CacheModule.register(),
		NestEmitterModule.forRoot(new EventEmitter()),
		ServerConfigModule,
		AuthenticationModule,
		AuthorizationModule,
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
