import { IncomingMessage } from "http";
import {
	Body,
	Controller,
	Post,
	Get,
	UseGuards,
	Query,
	Req,
	ClassSerializerInterceptor,
	UseInterceptors
} from "@nestjs/common";
import {
	ApiUseTags,
	ApiCreatedResponse,
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiBearerAuth
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { plainToClass } from "class-transformer";
import RoleGuard from "../auth/guards/role.guard";
import AuthProvider from "../auth/auth.provider";
import Roles from "../auth/role.decorator";
import Role from "../auth/role";
import User from "../user/user.entity";
import Transaction from "./transaction.entity";
import TransactionService from "./transaction.service";
import TransactionsResponseDto from "./dto/transactions-response.dto";
import CreatePayPalTransactionDto from "./dto/create-paypal-transaction.dto";

@ApiUseTags("transactions")
@Controller("transactions")
export default class TransactionController {
	public constructor(private readonly transactionService: TransactionService) {}

	@Post("paypal")
	@ApiBearerAuth()
	@UseGuards(AuthGuard(AuthProvider.JWT))
	@UseInterceptors(ClassSerializerInterceptor)
	public async create(
		@Body() createPayPalTrasactionDto: CreatePayPalTransactionDto,
		@Req() req: IncomingMessage & Request
	): Promise<Transaction> {
		return plainToClass(
			Transaction,
			await this.transactionService.create(createPayPalTrasactionDto, req.user as User)
		);
	}

	@Get()
	@ApiOkResponse({
		type: TransactionsResponseDto,
		description: "Transactions successfully retrieved"
	})
	@Roles(Role.USER)
	@UseGuards(AuthGuard(AuthProvider.JWT), RoleGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	public async get(@Query("userId") userId?: number): Promise<TransactionsResponseDto> {
		return plainToClass(TransactionsResponseDto, await this.transactionService.find({ userId }));
	}
}
