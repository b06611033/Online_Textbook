import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Column,
	UpdateDateColumn,
	ManyToMany,
	JoinTable,
	ManyToOne,
	JoinColumn
} from "typeorm";
import { ApiResponseProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import Subscription from "../subscription/subscription.entity";
import User from "../user/user.entity";

@Entity()
export default class Transaction {
	@ApiResponseProperty({ example: 1 })
	@PrimaryGeneratedColumn({ name: "transaction_id" })
	public readonly id: number;

	@ApiResponseProperty({ type: Subscription })
	@Type(() => Subscription)
	@ManyToMany(
		type => Subscription,
		subscription => subscription.transactions
	)
	@JoinTable({
		joinColumn: { name: "transaction_id" },
		inverseJoinColumn: { name: "subscription_id" }
	})
	public readonly subscriptions: Subscription[];

	@ApiResponseProperty({ example: true })
	@Column({ default: false })
	public readonly fulfilled: boolean;

	@ApiResponseProperty({ example: 1876 })
	@Column()
	// This number is in cents to avoid floating point arithmetic.
	public readonly total: number;

	@Exclude()
	@Type(() => User)
	@ManyToOne(
		type => User,
		user => user.transactions
	)
	@JoinColumn({ name: "user_id" })
	public readonly user: User;

	@ApiResponseProperty({ type: String, example: new Date().toISOString() })
	@Type(() => Date)
	@CreateDateColumn({ name: "created_at" })
	public readonly createdAt: Date;

	@Exclude()
	@UpdateDateColumn({ name: "updated_at" })
	public readonly updatedAt: Date;
}
