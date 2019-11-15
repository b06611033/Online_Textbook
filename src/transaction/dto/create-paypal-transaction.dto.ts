import { ApiModelProperty } from "@nestjs/swagger";
import { IsNumber, IsArray, ArrayUnique, ArrayNotEmpty } from "class-validator";

export default class CreatePayPalTransactionDto {
	@ApiModelProperty({ description: "Token ID from Stripe", example: "flkjasdf8929hhfkj" })
	@IsNumber()
	public readonly tokenId: string;

	@ApiModelProperty({ description: "Products bought by the user", isArray: true })
	@IsArray()
	@ArrayUnique()
	@ArrayNotEmpty()
	public readonly subscriptions: number[];
}
