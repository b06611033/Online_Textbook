import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ApplicationModule from "./app.module";
import EnvConfigService from "./server-config/env-config.service";

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create<NestExpressApplication>(ApplicationModule);

	const envConfigService = app.get(EnvConfigService);

	app.enableCors({
		origin: ["https://mymathapps.com", "https://dev.mymathapps.com"],
		methods: ["GET", "POST", "PATCH", "DELETE"],
		allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
		credentials: true
	});
	app
		.use(cookieParser())
		.use(helmet())
		.useGlobalPipes(
			new ValidationPipe({
				transform: false,
				whitelist: true,
				forbidNonWhitelisted: true,
				forbidUnknownValues: true,
				disableErrorMessages: envConfigService.nodeEnv === "production"
			})
		);

	const meta = new DocumentBuilder()
		.addBasicAuth()
		.addBearerAuth()
		.setTitle("MYMA Store API")
		.setDescription("MYMA Store API documentation")
		.setVersion("1.0.0")
		.build();
	const metaDocument = SwaggerModule.createDocument(app, meta);
	SwaggerModule.setup("api/docs", app, metaDocument);

	await app.listen(envConfigService.mymaStoreServerPort);
}

bootstrap();
