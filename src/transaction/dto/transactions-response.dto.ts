import { ApiResponseModelProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import Transaction from "../transaction.entity";

export default class TransactionsResponseDto {
	@ApiResponseModelProperty({ type: Transaction })
	@Type(() => Transaction)
	public readonly transactions: Transaction[];
}
