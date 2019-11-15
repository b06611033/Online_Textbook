import { Injectable, Logger } from "@nestjs/common";
import SubscriptionRepository from "../subscription/subscription.repository";
import User from "../user/user.entity";
import TransactionRepository from "./transaction.repository";
import Transaction from "./transaction.entity";
import CreateTransactionDto from "./dto/create-paypal-transaction.dto";
import TransactionsResponseDto from "./dto/transactions-response.dto";

export declare type FindOptions = {
	userId?: number;
};

@Injectable()
export default class TransactionService {
	private static readonly logger = new Logger(TransactionService.name);

	public constructor(
		private readonly transactionRepository: TransactionRepository,
		private readonly subscriptionRepository: SubscriptionRepository
	) {}

	public async create(
		createTransactionDto: CreateTransactionDto,
		user: User
	): Promise<Transaction> {
		const transaction = {
			...this.transactionRepository.create({
				...createTransactionDto,
				subscriptions: await this.subscriptionRepository.findByIds(
					createTransactionDto.subscriptions
				)
			}),
			user
		};
		return this.transactionRepository.save(transaction);
	}

	public async find(findOptions?: FindOptions): Promise<TransactionsResponseDto> {
		let transactions: Transaction[] = [];

		if (findOptions !== undefined) {
			transactions = await this.transactionRepository
				.createQueryBuilder("transaction")
				.innerJoinAndSelect("transaction.subscriptions", "subscription")
				.innerJoin("transaction.user", "user", "user.id = :id", {
					id: findOptions.userId
				})
				.getMany();
		} else {
			transactions = await this.transactionRepository.find();
		}

		return {
			transactions
		};
	}
}
