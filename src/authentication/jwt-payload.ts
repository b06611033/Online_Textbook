import RoleName from "../authorization/role-name";

export default interface JwtPayload {
	sub: number;
	roles: RoleName[];
}
