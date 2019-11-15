import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ConfigModule from "../config/config.module";
import UserRepository from "../user/user.repository";
import AuthModule from "../auth/auth.module";
import ProductController from "./product.controller";
import ProductService from "./product.service";
import ProductRepository from "./product.repository";

@Module({
	imports: [
		TypeOrmModule.forFeature([ProductRepository, UserRepository]),
		ConfigModule,
		AuthModule
	],
	controllers: [ProductController],
	providers: [ProductService],
	exports: [ProductService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class ProductModule {}
