import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import ConfigModule from "../config/config.module";
import JwtConfigService from "../config/jwt-config.service";
import UserRepository from "../user/user.repository";
import ProductRepository from "../product/product.repository";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import GoogleStrategy from "./strategies/google.strategy";
import JwtStrategy from "./strategies/jwt.strategy";

@Module({
	imports: [
		ConfigModule,
		TypeOrmModule.forFeature([UserRepository, ProductRepository]),
		PassportModule.register({ session: true }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useClass: JwtConfigService
		})
	],
	controllers: [AuthController],
	providers: [AuthService, GoogleStrategy, JwtStrategy],
	exports: [AuthService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class AuthModule {}
