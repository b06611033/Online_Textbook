import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToMany,
	JoinTable,
	CreateDateColumn,
	UpdateDateColumn
} from "typeorm";
import { ApiResponseProperty } from "@nestjs/swagger";
import { Type, Exclude } from "class-transformer";
import User from "../user/user.entity";
import RoleName from "./role-name";
import Permission from "./permission.entity";

@Entity()
export default class Role {
	@PrimaryGeneratedColumn({ name: "role_id" })
	public readonly id: number;

	@ApiResponseProperty({ enum: RoleName, example: RoleName.USER })
	@Column({ type: "enum", enum: RoleName })
	public readonly name: RoleName;

	@Exclude()
	@ManyToMany(
		type => User,
		user => user.roles
	)
	public readonly users: User[];

	@ApiResponseProperty({ type: [Permission] })
	@ManyToMany(
		type => Permission,
		permission => permission.roles
	)
	@JoinTable({
		name: "role_permissions",
		joinColumn: { name: "role_id" },
		inverseJoinColumn: { name: "permission_id" }
	})
	@Type(() => Permission)
	public readonly permissions: Permission[];

	@ApiResponseProperty({ type: String, example: new Date().toISOString() })
	@CreateDateColumn({ name: "created_at" })
	public readonly createdAt: Date;

	@ApiResponseProperty({ type: String, example: new Date().toISOString() })
	@UpdateDateColumn({ name: "updated_at" })
	public readonly updatedAt: Date;
}
