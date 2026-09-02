import React, { useState, useEffect } from "react";
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
export default function CustomerInfo() {
	const [user, setUser] = useState();
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
					setUser(data);
					const date = new Date(data.birthDate);
					const day = date.getDate();
					const month = date.getMonth() + 1;
					const year = date.getFullYear();
					setDob({ day: day, month: month, year: year });
				});
		}
	}, []);
	const [dob, setDob] = useState({ day: "", month: "", year: "" });
	const handleUpdateUser = () => {
		
			if (localStorage.getItem("auth-token")) {
				let date = new Date(dob.year, dob.month - 1, dob.day);
				fetch("http://localhost:3001/updateuser", {
					method: "POST",
					headers: {
						Accept: "application/form-data",
						"auth-token": `${localStorage.getItem("auth-token")}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: user.name,
						phone: user.phone,
						gender: user.gender,
						birthDate: date,
					}),
				}).then((response) => response.json()).then((data)=>{alert('Cập nhập thông tin thành công')})
			}
		
	};
	if (!user) {
		return <div>Loading...</div>;
	}
	return (
		<Container>
			<h2>Thông tin tài khoản</h2>
			<Content>
				<PersonalInfo>
					<FormGroup>
						<label>Họ & Tên</label>
						<Input
							value={user.name}
							onChange={(e) => setUser({ ...user, name: e.target.value })}
						/>
					</FormGroup>
					<FormGroup>
						<FaPhone /> Số điện thoại
						<Input
							value={user.phone}
							onChange={(e) => setUser({ ...user, phone: e.target.value })}
						/>
					</FormGroup>
					<FormGroup>
						<label>Ngày sinh</label>
						<DateSelect>
							<Select
								value={dob.day}
								onChange={(e) => setDob({ ...dob, day: e.target.value })}
							>
								{[...Array(31)].map((_, i) => (
									<option key={i} value={i + 1}>
										{i + 1}
									</option>
								))}
							</Select>
							<Select
								value={dob.month}
								onChange={(e) => setDob({ ...dob, month: e.target.value })}
							>
								{[...Array(12)].map((_, i) => (
									<option key={i} value={i + 1}>
										{i + 1}
									</option>
								))}
							</Select>
							<Select
								value={dob.year}
								onChange={(e) => setDob({ ...dob, year: e.target.value })}
							>
								{[...Array(75)].map((_, i) => (
									<option key={i} value={1975 + i}>
										{1975 + i}
									</option>
								))}
							</Select>
						</DateSelect>
					</FormGroup>
					<FormGroup>
						<label>Giới tính</label>
						<RadioGroup>
							<RadioLabel>
								<input
									type="radio"
									value="Nam"
									checked={"Nam" === user.gender}
									onChange={(e) => setUser({ ...user, gender: e.target.value })}
								/>
								Nam
							</RadioLabel>
							<RadioLabel>
								<input
									type="radio"
									value="Nữ"
									checked={"Nữ" === user.gender}
									onChange={(e) => setUser({ ...user, gender: e.target.value })}
								/>
								Nữ
							</RadioLabel>
						</RadioGroup>
					</FormGroup>

					<SaveButton onClick={handleUpdateUser}>Lưu thay đổi</SaveButton>
				</PersonalInfo>
				<SecurityInfo>
					<FormGroup>
						<FaEnvelope /> Email
						<Input value={user.email} onChange={() => {}} />
					</FormGroup>

					<FormGroup>
						<FaLock />
						Mật khẩu cũ
						<Input
							type="password"
							name="confirmPassword"
							placeholder="Xác nhận mật khẩu"
							value={""}
							onChange={() => {}}
							required
						/>
					</FormGroup>
					<FormGroup>
						<FaLock />
						Mật khẩu mới
						<Input
							type="password"
							name="confirmPassword"
							placeholder="Mật khẩu mới"
							value={""}
							onChange={() => {}}
							required
						/>
					</FormGroup>
					<UpdateButton>Cập nhật</UpdateButton>
					<InfoItem style={{ marginTop: "15px" }}>
						<div>
							<FaTrashAlt /> Yêu cầu xóa tài khoản
						</div>
						<UpdateButton onClick={()=>{}}>Yêu cầu</UpdateButton>
					</InfoItem>
				</SecurityInfo>
			</Content>
		</Container>
	);
}
const Container = styled.div`
	width: 100%;
`;

const Content = styled.div`
	display: flex;
	gap: 20px;
	box-sizing: border-box;
	border-radius: 10px;
	border: 2px solid rgb(154, 202, 210);
	background: white;
`;

const PersonalInfo = styled.div`
	flex: 1;
	background: white;
	padding: 20px;
	border-radius: 10px;
`;

const FormGroup = styled.div`
	margin-bottom: 15px;
	max-width: 450px;
`;

const Input = styled.input`
	width: 432px;
	padding: 8px;
	border: 1px solid #ccc;
	border-radius: 5px;
`;

const Select = styled.select`
	padding: 8px;
	border-radius: 5px;
`;

const DateSelect = styled.div`
	display: flex;
	gap: 5px;
`;

const RadioGroup = styled.div`
	display: flex;
	gap: 10px;
`;

const RadioLabel = styled.label`
	display: flex;
	align-items: center;
	gap: 5px;
`;

const SaveButton = styled.button`
	background: blue;
	color: white;
	padding: 10px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	width: 100%;
	&:hover {
			background: rgb(10, 114, 200);
		
		}
`;

const SecurityInfo = styled.div`
	flex: 1;
	padding: 20px;
	background: white;
`;

const InfoItem = styled.div`
	display: flex;
	justify-content: space-between;

	align-items: center;

	background: white;
	margin-bottom: 10px;
	border-radius: 5px;
`;

const UpdateButton = styled.button`
	background: ${(props) => (props.warning ? "red" : "blue")};
	color: white;
	padding: 5px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	width: 76px;
`;
