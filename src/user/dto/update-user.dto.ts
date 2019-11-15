import { IsString, IsEmail, IsOptional } from "class-validator";
import { ApiModelPropertyOptional } from "@nestjs/swagger";

export default class UpdateUserDto {
	@ApiModelPropertyOptional({ description: "New name", example: "Jane Doe" })
	@IsString()
	@IsOptional()
	public readonly name?: string;

	@ApiModelPropertyOptional({ description: "New email", example: "my.email@gmail.com" })
	@IsEmail()
	@IsOptional()
	public readonly email?: string;
}
