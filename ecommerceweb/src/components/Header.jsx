import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";
import profileIcon from "../assets/profileicon.png";
import logo from "../assets/logo.png";
export default function Header() {
	const [isLogin, setIsLogin] = useState(false);
	const [cartCount, setCartCount] = useState(0);
	useEffect(() => {
		setIsLogin(localStorage.getItem("auth-token"));
		if (localStorage.getItem("auth-token")) {
			fetch("http://localhost:3001/getcart", {
				method: "POST",
				headers: {
					Accept: "application/form-data",
					"auth-token": `${localStorage.getItem("auth-token")}`,
					"Content-Type": "application/json",
				},
				body: "",
			})
				.then((response) => response.json())
				.then((cartData) => {
					let count=0;
					for (let i = 0; i < cartData.length; i++) {
					let uniqueSizes = new Set();
						if (cartData[i].length > 0) {
							cartData[i].forEach((size) => uniqueSizes.add(size));
							count+= uniqueSizes.size;
						}

					}
					setCartCount(count);
				});
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("auth-token");
		setIsLogin(false);
		window.location.replace("/");
	};
	return (
		<Container>
			<div className="Menu">
				<div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
					<IoMenu />
					Menu
				</div>
			</div>
			<div className="Search">
				<StyledLink to="/search" state={{ category: "All"}}>
					<div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
						<FaSearch />
						<div style={{ margin: "0 5px" }}>Tìm kiếm</div>
					</div>
				</StyledLink>
			</div>
			<div className="Logo">
				<StyledLink to={`/`}>
					<img src={logo} alt="" style={{ height: "100px" }} />
				</StyledLink>
			</div>

			<div className="Login">
				{isLogin ? (
					<div
						style={{
							alignItems: "center",
							display: "flex",
							gap: "10px",
							cursor: "pointer",
						}}
					>
						<StyledLink to={`/login/`}>
							<LogoutLabel onClick={handleLogout}>LOGOUT</LogoutLabel>
						</StyledLink>
						<StyledLink to={`/profile/customer/info`}>
							<img style={{ width: "30px" }} src={profileIcon} alt="" />{" "}
						</StyledLink>
					</div>
				) : (
					<StyledLink to={`/login/`}>
						<FaUser />
					</StyledLink>
				)}
			</div>
			<div className="Cart">
				<StyledLink to={`/cart/`}>
					<CartIconContainer>
						<FaShoppingCart />
						{cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
					</CartIconContainer>
				</StyledLink>
			</div>
		</Container>
	);
}

const Container = styled.div`
	height: 100%;
	width: 100%;
	align-items: center;
	justify-content: center;
	justify-items: center;
	display: grid;
	grid-template-columns: 1fr 1fr 8fr 1fr 1fr;
	background-color: #f8f9fa;
	font-size: 20px;

	.Logo {
		font-size: 40px;
		font-weight: bold;
		align-items: center;
	}
`;
const StyledLink = styled(Link)`
	text-decoration: none;
	color: inherit;
`;
const LogoutLabel = styled.div`
	padding: 5px 10px;
	border: 2px solid #000;
	border-radius: 30px;
	font-weight: bold;
	text-transform: uppercase;
	display: inline-block;
	color: #000;
	transition: all 0.3s ease;

	&:hover {
		background-color: gray;
		color: #ffffff;
	}
`;
const CartIconContainer = styled.div`
	position: relative;
	display: inline-block;
`;

const CartBadge = styled.span`
	position: absolute;
	top: -10px;
	right: -8px;
	background: red;
	color: white;
	font-size: 12px;
	font-weight: bold;
	width: 15px;
	height: 15px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
`;
