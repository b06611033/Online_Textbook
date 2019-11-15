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
	ApiUseTags,
	ApiOkResponse,
	ApiNotFoundResponse,
	ApiForbiddenResponse,
	ApiBearerAuth
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import AuthProvider from "../auth/auth.provider";
import Roles from "../auth/role.decorator";
import Role from "../auth/role";
import RoleGuard from "../auth/guards/role.guard";
import User from "./user.entity";
import UserService from "./user.service";
import UpdateUserDto from "./dto/update-user.dto";

@ApiUseTags("users")
@Controller("users")
export default class UserController {
	public constructor(private readonly userService: UserService) {}

	@Get()
	@ApiBearerAuth()
	@ApiOkResponse({ type: User, description: "User successfully retrieved" })
	@ApiNotFoundResponse({ description: "User does not exist" })
	@ApiForbiddenResponse({ description: "Forbidden resource" })
	@Roles(Role.USER)
	@UseGuards(AuthGuard(AuthProvider.JWT), RoleGuard)
	@UseInterceptors(ClassSerializerInterceptor)
	public async get(@Query("userId") id: number): Promise<User> {
		const user = await this.userService.findById(id);
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
	@Roles(Role.ADMIN)
	@UseGuards(AuthGuard(AuthProvider.JWT), RoleGuard)
	public delete(@Param("id") id: number): Promise<boolean> {
		return this.userService.delete(id);
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
		if ((await this.userService.findById(id)) === undefined) {
			throw new NotFoundException(`User of ID ${id} does not exist`);
		}

		await this.userService.update(id, updateUserDto);
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
}
