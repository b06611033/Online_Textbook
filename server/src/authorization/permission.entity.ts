import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToMany,
	CreateDateColumn,
	UpdateDateColumn
} from "typeorm";
import { ApiResponseProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import PermissionName from "./permission-name";
import Role from "./role.entity";

@Entity()
export default class Permission {
	@ApiResponseProperty({ example: 1 })
	@PrimaryGeneratedColumn({ name: "permission_id" })
	public readonly id: number;

	@ApiResponseProperty({ enum: PermissionName, example: PermissionName.READ_SELF })
	@Column({ type: "enum", enum: PermissionName })
	public readonly name: PermissionName;

	@ApiResponseProperty({ type: [Role] })
	@ManyToMany(
		type => Role,
		role => role.permissions
	)
	@Type(() => Role)
	public readonly roles: Role[];

	@ApiResponseProperty({ type: String, example: new Date().toISOString() })
	@CreateDateColumn({ name: "created_at" })
	public readonly createdAt: Date;

	@ApiResponseProperty({ type: String, example: new Date().toISOString() })
	@UpdateDateColumn({ name: "updated_at" })
	public readonly updatedAt: Date;
}
