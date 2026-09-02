import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
	FaUser,
	FaPhone,
	FaEnvelope,
	FaLock,
	FaShieldAlt,
	FaTrashAlt,
	FaFacebook,
	FaGoogle,
} from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { FaWpforms } from "react-icons/fa6";
import { GiPositionMarker } from "react-icons/gi";
import { Link } from "react-router-dom";
import CustomerInfo from "./CustomerInfo";
import Order from "./Order";
import Address from "./Address";
import { Routes, Route } from "react-router-dom";
import EditAddress from "./EditAddress";
import CreateAddress from "./CreateAddress";
import OrderDetail from "./OrderDetail";

export default function Profile() {
	return (
		<Container>
			<NavBarContainer>
				<StyledLink to={`/profile/customer/info`}>
					<NavItem>
						<RxAvatar style={{ paddingLeft: "15px" }} />
						<div>Thông tin tài khoản</div>
					</NavItem>
				</StyledLink>
				<StyledLink to={`/profile/customer/order`}>
					<NavItem>
						<FaWpforms style={{ paddingLeft: "15px" }} />
						<div>Quản lý đơn hàng</div>
					</NavItem>
				</StyledLink>
				<StyledLink to={`/profile/customer/address`}>
					<NavItem>
						<GiPositionMarker style={{ paddingLeft: "15px" }} />
						<div>Sổ địa chỉ</div>
					</NavItem>
				</StyledLink>
			</NavBarContainer>
			<InfoContainer>
				<Routes>
					<Route path="customer/info" element={<CustomerInfo />} />
					<Route path="customer/order/*" element={<Order />} />
					<Route path="customer/order/:id" element={<OrderDetail />} />
					<Route path="customer/address/*" element={<Address />} />
					<Route path="customer/address/create" element={<CreateAddress />} />
					<Route path="customer/address/edit/:index" element={<EditAddress />} />
				</Routes>
			</InfoContainer>
		</Container>
	);
}

/* Styled Components */
const Container = styled.div`
	width: 70%;
	margin: auto;
	display: grid;

	padding: 40px 20px;
	grid-template-columns: 1fr 5fr;
	gap: 20px;
`;
const NavBarContainer = styled.div`
	width: 100%;
	padding-top: 67px;
`;
const NavItem = styled.div`
	width: 100%;
	height: 40px;
	align-items: center;
	cursor: pointer;
	background: #f5f5fa;
	gap: 15px;
	display: flex;
	&:hover {
		background: #ebebf0;
	}
`;
const InfoContainer = styled.div`
	width: 100%;
`;
const StyledLink = styled(Link)`
	text-decoration: none;
	color: inherit;
`;
