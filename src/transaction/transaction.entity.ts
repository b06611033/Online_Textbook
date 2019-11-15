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
import { ApiResponseModelProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import Subscription from "../subscription/subscription.entity";
import User from "../user/user.entity";

@Entity()
export default class Transaction {
	@ApiResponseModelProperty({ example: 1 })
	@PrimaryGeneratedColumn({ name: "transaction_id" })
	public readonly id: number;

	@ApiResponseModelProperty({ type: Subscription })
	@Type(() => Subscription)
	@ManyToMany(type => Subscription, subscription => subscription.transactions)
	@JoinTable({
		joinColumn: { name: "transaction_id" },
		inverseJoinColumn: { name: "subscription_id" }
	})
	public readonly subscriptions: Subscription[];

	@ApiResponseModelProperty({ example: true })
	@Column({ default: false })
	public readonly fulfilled: boolean;

	@ApiResponseModelProperty({ example: 1876 })
	@Column()
	// This number is in cents to avoid floating point arithmetic.
	public readonly total: number;

	@Exclude()
	@Type(() => User)
	@ManyToOne(type => User, user => user.transactions)
	@JoinColumn({ name: "user_id" })
	public readonly user: User;

	@ApiResponseModelProperty({ type: String, example: new Date().toISOString() })
	@Type(() => Date)
	@CreateDateColumn({ name: "created_at" })
	public readonly createdAt: Date;

	@Exclude()
	@UpdateDateColumn({ name: "updated_at" })
	public readonly updatedAt: Date;
}
