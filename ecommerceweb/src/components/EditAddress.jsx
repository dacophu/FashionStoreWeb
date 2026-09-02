import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function EditAddress() {
    const navigate= useNavigate();
	const { index } = useParams();
	const [address, setAddress] = useState();
	const [checked, setChecked] = useState(false);
	const [isDefault, setIsDefault] = useState(false);
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
					setAddress(data.address.address[index]);
					setIsDefault(data.address.default == index);
				});
		}
	}, [index]);
	const hanldeUpdateAddress = () => {
		if (localStorage.getItem("auth-token")) {
			fetch("http://localhost:3001/updateaddress", {
				method: "POST",
				headers: {
					Accept: "application/form-data",
					"auth-token": `${localStorage.getItem("auth-token")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					address: address,
					isDefault: checked,
                    index:parseInt(index),
				}),
			}).then((response) => {
                if(response.ok)
                {
                    alert('Cập nhập địa chỉ thành công');
                    navigate('/profile/customer/address')
                }
            })
		}
	};
	return (
		<Container>
			<h3>Chỉnh sửa địa chỉ</h3>
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
				{!isDefault && (
					<FormControl>
						<div>{}</div>
						<div style={{ display: "flex", gap: "10px" }}>
							<input
								type="checkbox"
								value={checked}
								onChange={(e) => setChecked(e.target.checked)}
							/>
							<div>Đặt làm địa chỉ mặc định</div>
						</div>
					</FormControl>
				)}
				<FormControl>
					<div>{}</div>
					<button onClick={hanldeUpdateAddress}>Cập nhật</button>
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
