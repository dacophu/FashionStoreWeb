import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Form, Image } from "react-bootstrap";
import { BsCheck2Square } from "react-icons/bs";
import { useLocation,useNavigate } from "react-router-dom";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaShippingFast } from "react-icons/fa";
export default function Shipping() {
	const navigate=useNavigate();
	const [userInfo, setUserInfo] = useState({});
	const [address, setAddress] = useState();
	const [shippingMethod, SetShippingMethod] = useState({
		name: "Giao tiết kiệm",
		fee: 25000,
	});
	const location = useLocation();
	const productsToOrder = location.state?.selectedItems || [];
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
					console.log(data);
					setAddress(data.address.address[data.address.default]);
					setUserInfo(data);
				});
		}
	}, []);

	if (!userInfo) {
		return <div>Loading...</div>;
	}

	let totalprice = 0;
	productsToOrder.map((product, index) => (totalprice += product.old_price));

	let discountFee = 0;
	productsToOrder.map(
		(product, index) => (discountFee += product.old_price - product.new_price)
	);

	const handleOrder = () => {
		if (localStorage.getItem("auth-token")) {
			fetch("http://localhost:3001/createorder", {
				method: "POST",
				headers: {
					Accept: "application/form-data",
					"auth-token": `${localStorage.getItem("auth-token")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					product: productsToOrder,
					address: address,
					delivery_date: Date.now(),
					shipping_method:shippingMethod,
					total:totalprice - discountFee + shippingMethod.fee
				}),
			}).then(async (response) => {
				if (response.ok) {
					for (const itemToRemove of productsToOrder) {
						try {
							const response = await fetch(
								"http://localhost:3001/removefromcart",
								{
									method: "POST",
									headers: {
										Accept: "application/form-data",
										"auth-token": `${localStorage.getItem("auth-token")}`,
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										itemId: itemToRemove.id,
										size: itemToRemove.size,
									}),
								}
							);
						} catch (error) {
							console.error("Error removing item:", error);
						}
					}
					alert("Đặt hàng thành công");
					navigate(`/`);
				}
			});
		}
	};
	return (
		<Container>
			<LeftWrapper>
				<ShippingMethodWrapper>
					<h3>Hình thức giao hàng</h3>
					<ShippingOptionsWrapper>
						<CardWrapper>
							<Form.Check
								type="radio"
								name="shipping"
								checked={shippingMethod.name === "Giao tiết kiệm"}
								onChange={() =>
									SetShippingMethod({ name: "Giao tiết kiệm", fee: 25000 })
								}
							/>
							<ShippingText>Giao tiết kiệm</ShippingText>
							<DiscountTag>-25K</DiscountTag>
						</CardWrapper>
						<CardWrapper>
							<Form.Check
								type="radio"
								name="shipping"
								checked={shippingMethod.name === "Giao nhanh"}
								onChange={() =>
									SetShippingMethod({ name: "Giao nhanh", fee: 50000 })
								}
							/>
							<ShippingText>Giao nhanh</ShippingText>
							<DiscountTag>-50k</DiscountTag>
						</CardWrapper>{" "}
					</ShippingOptionsWrapper>
					<ForecastOrderInfoWrapper>
						<DeliveryHeader>
							<BsCheck2Square size={20} />
							<span>Gói: Giao ngày mai, trước 17h, 13/02</span>
						</DeliveryHeader>
						<ContentWrapper>
							<LeftContent>
								<ShippingMethod>
									<div>{shippingMethod.name}</div>
									<div>{shippingMethod.fee} đ</div>
								</ShippingMethod>
								{productsToOrder.map((product, index) => (
									<ProductItem key={index}>
										<ProductIcon src={product.image} />
										<ItemInfo>
											{product.name}
											<div
												style={{
													display: "flex",
													justifyContent: "space-between",
												}}
											>
												<div>SL:x{product.quantity}</div>
												<div style={{ display: "flex", gap: "5px" }}>
													<div style={{ textDecoration: "line-through" }}>
														{product.old_price} đ
													</div>
													<div style={{ color: "red" }}>
														{product.new_price} đ
													</div>
												</div>
											</div>
										</ItemInfo>
									</ProductItem>
								))}
							</LeftContent>
							<RightContent>
								<div
									style={{
										display: "flex",
										gap: "8px",
										borderRadius: "3px",
										background: " #F5F5FA",
										color: "#808089",
										height: "50px",
										padding: "10px",
									}}
								>
									<FaShippingFast /> Được giao bởi J&T Express
								</div>
							</RightContent>
						</ContentWrapper>
					</ForecastOrderInfoWrapper>
				</ShippingMethodWrapper>
				<PaymentMethodWrapper>
					<h3>Chọn hình thức thanh toán</h3>
					<PaymentMethod>
						<input type="radio" defaultChecked />
						<div
							style={{
								display: "flex",
								alignItems: "center",
								fontSize: "16px",
							}}
						>
							<GiTakeMyMoney />
							Thanh toán tiền mặt
						</div>
					</PaymentMethod>
				</PaymentMethodWrapper>
			</LeftWrapper>
			<RightWrapper>
				<AddressWrapper>
					<AddressHeader>Giao tới</AddressHeader>
					<CustomerInfo>
						<div>{userInfo.name}</div>
						<i
							style={{
								color: "black",
								width: "1px",
								boxSizing: "border-box",
								backgroundColor: "rgb(235, 235, 240)",
							}}
						></i>
						<div>{userInfo.phone}</div>
					</CustomerInfo>
					<AddressInfo>{address}</AddressInfo>
				</AddressWrapper>
				<OrderWrapper>
					<OrderHeader>
						<div>Đơn hàng</div>
						<div style={{ color: "rgb(128, 128, 137)" }}>
							{productsToOrder.length} sản phẩm
						</div>
					</OrderHeader>
					<OrderShippingInfo>
						<OrderShippingInfoItem>
							<div>Tổng tiền hàng</div>
							<div style={{ color: "black" }}>{totalprice}đ</div>
						</OrderShippingInfoItem>
						<OrderShippingInfoItem>
							<div>Phí vận chuyển</div>
							<div style={{ color: "black" }}>{shippingMethod.fee}đ</div>
						</OrderShippingInfoItem>
						<OrderShippingInfoItem>
							<div>Giảm giá trực tiếp</div>
							<div style={{ color: "#29AB71" }}>-{discountFee}đ</div>
						</OrderShippingInfoItem>
					</OrderShippingInfo>
					<OrderShippingTotal>
						<div>Tổng tiền thanh toán</div>
						<div>
							<div style={{ justifySelf: "end", color: "red" }}>
								{totalprice - discountFee + shippingMethod.fee}đ
							</div>
							<div style={{ color: "#29AB71" }}>Tiết kiệm {discountFee}đ</div>
						</div>
					</OrderShippingTotal>
					<div>
						<button onClick={handleOrder}>Đặt hàng</button>
					</div>
				</OrderWrapper>
			</RightWrapper>
		</Container>
	);
}

const Container = styled.div`
	display: grid;
	grid-template-columns: 3fr 1fr;
	width: 75%;
	margin: 0 auto;
	padding: 50px 0;
	gap: 20px;
`;

const LeftWrapper = styled.div`
	width: 100%;
`;
const ShippingMethodWrapper = styled.div`
	background: white;
	border-radius: 5px;
	padding: 16px;
	margin-bottom: 16px;
`;
const ShippingOptionsWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	height: 66px;
	gap: 50px;
`;
const CardWrapper = styled.div`
	background-color: #f4f9ff;
	padding: 12px;
	border-radius: 10px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	position: relative;
	display: flex;
	align-items: center;
	width: auto;
`;

const ShippingText = styled.span`
	margin-left: 8px;
	font-size: 14px;
	font-weight: 500;
`;

const DiscountTag = styled.span`
	margin-left: 8px;
	font-size: 14px;
	font-weight: 500;
	color: green;
	background: #fff;
	padding: 2px 6px;
	border-radius: 4px;
`;
const ForecastOrderInfoWrapper = styled.div`
	margin-top: 20px;
	box-sizing: border-box;
	border-radius: 8px;
	border: 1px solid #e5e7eb;
	padding: 16px;
	background: white;
`;
const DeliveryHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	color: #22c55e;
	margin-bottom: 6px;
`;

const ContentWrapper = styled.div`
	display: grid;
	grid-template-columns: 3fr 2fr;
`;
const LeftContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;
const ShippingMethod = styled.div`
	padding-top: 10px;
	display: flex;
	justify-content: space-between;
	width: 100%;
`;
const ProductItem = styled.div`
	display: flex;
`;
const ProductIcon = styled(Image)`
	width: 50px;
	height: 50px;
	margin-right: 8px;
`;
const ItemInfo = styled.div`
	display: grid;
	grid-template-rows: 1fr 1fr;
	width: 100%;
`;
const RightContent = styled.div`
	margin: 0 20px;
	display: flex;
	align-items: flex-start;
`;

const PaymentMethodWrapper = styled.div`
	background: white;
	border-radius: 5px;
	padding: 16px;
	align-items: center;
`;
const PaymentMethod = styled.div`
	display: flex;
	gap: 10px;
	height: 50px;
`;

const RightWrapper = styled.div``;
const AddressWrapper = styled.div`
	background: white;
	border-radius: 5px;
	padding: 16px;
	margin-bottom: 16px;
`;
const AddressHeader = styled.div`
	font-size: 16px;
`;
const CustomerInfo = styled.div`
	display: flex;
	gap: 10px;
	color: rgb(56, 56, 61);
	font-weight: 600;
	font-size: 14px;
`;
const AddressInfo = styled.div`
	color: #909ab7;
`;

const OrderWrapper = styled.div`
	background: white;
	border-radius: 5px;
	padding: 16px;
	button {
		background: #ff424e;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 1rem;
		margin-top: 10px;
		width: 100%;
		&:hover {
			background: #c0392b;
		}
	}
`;
const OrderHeader = styled.div`
	font-size: 16px;
`;
const OrderShippingInfo = styled.div`
	font-size: 16px;
	color: rgb(128, 128, 137);
	padding: 8px 0;
`;
const OrderShippingInfoItem = styled.div`
	font-size: 16px;
	color: rgb(128, 128, 137);
	display: flex;
	justify-content: space-between;
`;

const OrderShippingTotal = styled.div`
	display: flex;
	justify-content: space-between;
	font-size: 16px;
	color: rgb(39, 39, 42);
	font-weight: 500;
`;
