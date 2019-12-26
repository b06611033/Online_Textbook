import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import JwtConfigService from "../server-config/jwt-config.service";
import UserRepository from "../user/user.repository";
import ProductRepository from "../product/product.repository";
import ServerConfigModule from "../server-config/server-config.module";
import AuthController from "./auth.controller";
import GoogleStrategy from "./strategies/google.strategy";
import JwtStrategy from "./strategies/jwt.strategy";
import AuthService from "./auth.service";

@Module({
	imports: [
		ServerConfigModule,
		TypeOrmModule.forFeature([UserRepository, ProductRepository]),
		PassportModule.register({ session: true }),
		JwtModule.registerAsync({
			imports: [ServerConfigModule],
			useClass: JwtConfigService
		})
	],
	controllers: [AuthController],
	providers: [AuthService, GoogleStrategy, JwtStrategy],
	exports: [AuthService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class AuthModule {}
