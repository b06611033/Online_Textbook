import { IncomingMessage } from "http";
import {
	Controller,
	Get,
	Patch,
	Delete,
	UseGuards,
	Param,
	Query,
	NotFoundException,
	Body,
	UseInterceptors,
	ClassSerializerInterceptor,
	Req
} from "@nestjs/common";
import {
	ApiTags,
	ApiOkResponse,
	ApiNotFoundResponse,
	ApiForbiddenResponse,
	ApiBearerAuth
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { plainToClass } from "class-transformer";
import AuthProvider from "../auth/auth.provider";
import Roles from "../auth/role.decorator";
import Role from "../auth/role";
import RoleGuard from "../auth/guards/role.guard";
import TransactionRepository from "../transaction/transaction.repository";
import TransactionsDto from "../transaction/dto/responses/transactions.dto";
import User from "./user.entity";
import UserService from "./user.service";
import UpdateUserDto from "./dto/requests/update-user.dto";
import UserRepository from "./user.repository";

@ApiTags("users")
@Controller("users")
export default class UserController {
	public constructor(
		private readonly userService: UserService,
		private readonly userRepository: UserRepository,
		private readonly transactionRepository: TransactionRepository
	) {}

	@Get(":id")
	@ApiBearerAuth()
	@ApiOkResponse({ type: User, description: "User successfully retrieved" })
	@ApiNotFoundResponse({ description: "User does not exist" })
	@ApiForbiddenResponse({ description: "Forbidden resource" })
	@Roles(Role.USER)
	@UseGuards(AuthGuard(AuthProvider.JWT), RoleGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	public async getUser(@Param("id") id: number): Promise<User> {
		const user = await this.userRepository.findOne(id);
		if (user === undefined) {
			throw new NotFoundException(`User of ID ${id} does not exist`);
		}

		return user;
	}

	@Delete(":id")
	@ApiOkResponse({ type: User, description: "User deleted" })
	@ApiNotFoundResponse({ description: "User does not exist" })
	@ApiForbiddenResponse({ description: "Forbidden resource" })
	@ApiBearerAuth()
	@Roles(Role.USER)
	@UseGuards(AuthGuard(AuthProvider.JWT), RoleGuard)
	public async delete(@Param("id") id: number): Promise<void> {
		await this.userRepository.delete({ id });
	}

	@Patch(":id")
	@ApiBearerAuth()
	@ApiOkResponse({ type: User, description: "User successfully update" })
	@ApiNotFoundResponse({ description: "User does not exist" })
	@ApiForbiddenResponse({ description: "Forbidden resource" })
	@Roles(Role.USER)
	@UseGuards(AuthGuard(AuthProvider.JWT), RoleGuard)
	public async update(
		@Param("id") id: number,
		@Body() updateUserDto: UpdateUserDto
	): Promise<void> {
		const user = await this.userRepository.findOne(id);
		if (user === undefined) {
			throw new NotFoundException(`User of ID ${id} does not exist`);
		}

		await this.userRepository.update(user.id, updateUserDto);
	}

	@Get("me")
	@ApiBearerAuth()
	@ApiOkResponse({ type: User, description: "User successfully retrieved" })
	@ApiNotFoundResponse({ description: "User does not exist" })
	@ApiForbiddenResponse({ description: "Forbidden resource" })
	@UseGuards(AuthGuard(AuthProvider.JWT))
	@UseInterceptors(ClassSerializerInterceptor)
	// eslint-disable-next-line class-methods-use-this
	public me(@Req() req: IncomingMessage & Request): User | undefined {
		return req.user as User;
	}

	@Get(":id/transactions")
	@ApiOkResponse({
		type: TransactionsDto,
		description: "Transactions successfully retrieved"
	})
	@Roles(Role.USER)
	@UseGuards(AuthGuard(AuthProvider.JWT), RoleGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	public async getUserTransactions(@Param("id") id: number): Promise<TransactionsDto> {
		const transactions = await this.transactionRepository.findByUserId(id);

		return plainToClass(TransactionsDto, { transactions } as TransactionsDto);
	}
}
