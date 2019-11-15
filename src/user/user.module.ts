import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import UserController from "./user.controller";
import UserService from "./user.service";
import UserRepository from "./user.repository";

@Module({
	imports: [TypeOrmModule.forFeature([UserRepository])],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class UserModule {}
