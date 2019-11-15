import { ApiModelProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export default class CreateProductDto {
	@ApiModelProperty({
		description: "Title of the product",
		example: "Calculus 1"
	})
	@IsString()
	public readonly title: string;

	@ApiModelProperty({
		description: "Code name of the product",
		example: "MYCalc1"
	})
	@IsString()
	public readonly codeName: string;

	@ApiModelProperty({
		description: "Tag line for the product",
		example: "Calculus is easy as Pi",
		default: null
	})
	@IsString()
	@IsOptional()
	public readonly tagline?: string;

	@ApiModelProperty({
		description: "Description of the project",
		example: "Calculus 1 is a great online textbook for learning Calculus 1."
	})
	@IsString()
	public readonly description: string;

	@ApiModelProperty({
		description: "Start page of the product",
		example: "MContents.html",
		default: null
	})
	@IsString()
	@IsOptional()
	public readonly startPage?: string;
}
