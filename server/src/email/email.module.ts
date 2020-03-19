import { Module } from "@nestjs/common";
import ServerConfigModule from "../server-config/server-config.module";
import EmailService from "./email.service";
import UserModule from "../user/user.module";

@Module({
	imports: [ServerConfigModule, UserModule],
	providers: [EmailService],
	exports: [EmailService]
})
export default class EmailModule {}
