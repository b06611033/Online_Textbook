import { Logger } from "@nestjs/common";
import { Repository, EntityRepository } from "typeorm";
import Transaction from "./transaction.entity";

@EntityRepository(Transaction)
export default class TransactionRepository extends Repository<Transaction> {
	private static readonly logger = new Logger(TransactionRepository.name);
}
