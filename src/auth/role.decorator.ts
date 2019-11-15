import { SetMetadata } from "@nestjs/common";
import Role from "./role";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
export default Roles;
