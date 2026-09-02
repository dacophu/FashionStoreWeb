import React, { useEffect, useState } from "react";
import styled from "styled-components";
export default function CreateAddress() {
	const [address, setAddress] = useState("Nhập địa chỉ");
	const [checked, setChecked] = useState(false);
	const handleCreateAddress = () => {
		if (localStorage.getItem("auth-token")) {
			fetch("http://localhost:3001/createaddress", {
				method: "POST",
				headers: {
					Accept: "application/form-data",
					"auth-token": `${localStorage.getItem("auth-token")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					address:address,
					isDefault: checked,
				}),
			}).then((response) => response.json());
		}
	};
	return (
		<Container>
			<h3>Tạo sổ địa chỉ</h3>
			<FormWrapper>
				<FormControl>
					<div>Địa chỉ:</div>
					<div>
						<textarea
							id="addressTA"
							rows="5"
							cols="80"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						></textarea>
					</div>
				</FormControl>
				<FormControl>
					<div>{}</div>
					<div style={{ display: "flex", gap: "10px" }}>
						<input type="checkbox" value={checked} onChange={(e)=>setChecked(e.target.checked) }/>
						<div>Đặt làm địa chỉ mặc định</div>
					</div>
				</FormControl>
				<FormControl>
					<div>{}</div>
					<button onClick={handleCreateAddress}>Cập nhật</button>
				</FormControl>
			</FormWrapper>
		</Container>
	);
}

const Container = styled.div``;

const FormWrapper = styled.div`
	background: white;
	padding: 20px;
`;
const FormControl = styled.div`
	display: grid;
	grid-template-columns: 1fr 5fr;
	margin: 15px;
	button {
		height: 50px;
		width: 200px;
		cursor: pointer;
		background: #fdd835;
		border-radius: 5px;
		border: none;
		&:hover {
			background: rgb(214, 215, 113);
		}
	}
`;
