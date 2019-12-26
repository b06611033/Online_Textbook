import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import TransactionRepository from "../transaction/transaction.repository";
import UserController from "./user.controller";
import UserService from "./user.service";
import UserRepository from "./user.repository";

@Module({
	imports: [TypeOrmModule.forFeature([UserRepository, TransactionRepository])],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class UserModule {}
