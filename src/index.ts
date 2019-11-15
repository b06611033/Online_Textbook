import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import ApplicationModule from "./app.module";

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create<NestExpressApplication>(ApplicationModule);

	app.enableCors({
		origin: ["https://mymathapps.com", "https://dev.mymathapps.com"],
		methods: ["GET", "POST", "PATCH", "DELETE"],
		allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
		credentials: true
	});
	app.use(cookieParser());
	app.setGlobalPrefix("/api/v1");
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	const meta = new DocumentBuilder()
		.addBearerAuth()
		.setTitle("MYMA Store API")
		.setDescription("MYMA Store API documentation")
		.setVersion("1.0.0")
		.setBasePath("api/v1")
		.build();
	const metaDocument = SwaggerModule.createDocument(app, meta);
	SwaggerModule.setup("api/v1/docs", app, metaDocument);

	await app.listen(8080);
}

bootstrap();
