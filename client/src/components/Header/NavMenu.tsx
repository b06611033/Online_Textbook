import React, { useContext, useState, useCallback } from "react";
import { Menu, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { ApplicationContext } from "../../context";
import Cart from "./Cart";
import Profile from "./Profile";
import LoginSignUp from "./LoginSignUp";
import LoginSignUpModal from "./LoginSignUpModal";

const NavMenu: React.FC = (): JSX.Element => {
	const ctx = useContext(ApplicationContext);
	const [open, setOpen] = useState<boolean>(false);
	const [action, setAction] = useState<"login" | "sign-up">("login");

	const onClick = useCallback(
		(a: "login" | "sign-up"): void => {
			setOpen(true);
			setAction(a);
		},
		[setOpen, setAction]
	);

	const onClose = useCallback(() => setOpen(false), [setOpen]);

	return (
		<div>
			<Menu>
				<Menu.Item as={Link} header to="/">
					{"MYMathApps"}
				</Menu.Item>
				<Dropdown item text="Products">
					<Dropdown.Menu>
						<Dropdown.Item as={Link} to="/products">
							{"Overview"}
						</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown className="link item" pointing="left" text="Calculus">
							<Dropdown.Menu>
								<Dropdown.Item as={Link} to="/products/MYMACalc1">
									{"Calculus 1"}
								</Dropdown.Item>
								<Dropdown.Item as={Link} to="/products/MYMACalc2">
									{"Calculus 2"}
								</Dropdown.Item>
								<Dropdown.Item as={Link} to="/products/MYMACalc3">
									{"Calculus 3"}
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
						<Dropdown.Item as={Link} to="/products/m4c">
							{"Maplets for Calculus"}
						</Dropdown.Item>

						<Dropdown.Item as={Link} to="/products/finance-with-maple">
							{"Finance with Maple"}
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				<Menu.Item as={Link} to="/about">
					{"About Us"}
				</Menu.Item>
				<Menu.Item as={Link} to="/contact">
					{"Contact"}
				</Menu.Item>
				<Menu.Item fitted position="right">
					<Cart />
					{ctx.user ? <Profile /> : <LoginSignUp onClick={onClick} />}
				</Menu.Item>
			</Menu>
			<LoginSignUpModal action={action} onClose={onClose} open={open} />
		</div>
	);
};

export default NavMenu;
