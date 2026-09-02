import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import CreateAddress from "./CreateAddress";
import EditAddress from "./EditAddress";
export default function Address() {
	const [userInfo, setUserInfo] = useState([]);
	const [address, setAddress] = useState([]);

	const location = useLocation();

	useEffect(() => {
		if (localStorage.getItem("auth-token")) {
			fetch("http://localhost:3001/getuser", {
				method: "POST",
				headers: {
					Accept: "application/form-data",
					"auth-token": `${localStorage.getItem("auth-token")}`,
					"Content-Type": "application/json",
				},
				body: "",
			})
				.then((response) => response.json())
				.then((data) => {
					setUserInfo(data);
					setAddress(data.address.address);
				});
		}
	}, []);
	if (!userInfo) {
		return <div>loading...</div>;
	}

	return (
		<Container>
			
				<AddressContainer>
					<h2>Sổ địa chỉ</h2>
					<StyledLink to="create">
						<CreateAddressButton>Thêm địa chỉ mới</CreateAddressButton>
					</StyledLink>
					<AddressWrapper>
						{address.map((item, index) => (
							<AddressItem key={index}>
								<div>
									<div
										style={{
											marginBottom: "10px",
											fontSize: "18px",
											fontWeight: "400",
										}}
									>
										{userInfo.name}
									</div>
									<div style={{ marginBottom: "10px" }}>Địa chỉ: {item}</div>
									<div>Số điện thoại: {userInfo.phone}</div>{" "}
								</div>
								<div>
									<StyledLink to={`edit/${index}`}>
									<EditButton>Chỉnh sửa</EditButton></StyledLink>{" "}
								</div>
							</AddressItem>
						))}
					</AddressWrapper>
				</AddressContainer>
			
			
		</Container>
	);
}
const Container = styled.div``;
const AddressContainer = styled.div``;
const CreateAddressButton = styled.div`
	display: flex;
	cursor: pointer;
	background: white;
	height: 50px;
	font-size: 16px;
	color: #0b74e9;
	align-items: center;
	justify-content: center;
	margin-bottom: 10px;
`;
const AddressWrapper = styled.div``;
const AddressItem = styled.div`
	display: flex;
	background: white;
	margin-bottom: 10px;
	padding: 10px;
	justify-content: space-between;
`;
const StyledLink = styled(Link)`
	text-decoration: none;
	color: inherit;
`;

const EditButton = styled.button`
	cursor: pointer;
	color: #1babff;
	border: none;
	background: none;
	padding: 12px;
`;
