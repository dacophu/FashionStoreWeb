import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Order() {
	const navigate = useNavigate();
	const [allOrders, setAllOrders] = useState();
	const [processingOrders, setProcessingOrders] = useState();
	const [inTransitOrders, setInTransitOrders] = useState();
	const [deliveredOrders, setDeliveredOrders] = useState();
	const [canceledOrders, setCanceledOrders] = useState();
	const [orders, setOrders] = useState();
	const [products, setProducts] = useState();
	const [selectedTab, setSelectedTab] = useState("all");
	useEffect(() => {
		if (localStorage.getItem("auth-token")) {
			fetch("http://localhost:3001/getorder", {
				method: "POST",
				headers: {
					Accept: "application/form-data",
					"auth-token": `${localStorage.getItem("auth-token")}`,
					"Content-Type": "application/json",
				},
				body: "",
			})
				.then((response) => response.json())
				.then(async (data) => {
					console.log(data);
					setAllOrders(data);
					setProcessingOrders(
						data.filter((order) => order.status === "processing")
					);
					setInTransitOrders(
						data.filter((order) => order.status === "inTransit")
					);
					setDeliveredOrders(
						data.filter((order) => order.status === "delivered")
					);
					setCanceledOrders(
						data.filter((order) => order.status === "canceled")
					);
					setOrders(data);
					const uniqueProductIds = [
						...new Set(data.map((item) => item.product_id)),
					];
					const productData = await Promise.all(
						uniqueProductIds.map((productId) =>
							fetch(`http://localhost:3001/product/${productId}`)
								.then((response) => response.json())
								.then((product) => product[0])
						)
					);
					console.log(productData);
					setProducts(productData);
				});
		}
	}, []);

	const handleTabClick = (tab) => {
		setSelectedTab(tab);
		switch (tab) {
			case "processing":
				setOrders(processingOrders);
				break;
			case "inTransit":
				setOrders(inTransitOrders);
				break;
			case "delivered":
				setOrders(deliveredOrders);
				break;
			case "canceled":
				setOrders(canceledOrders);
				break;
			default:
				setOrders(allOrders);
		}
	};
	const hanldeBuyAgain = (productData, order) => {
		let newObj = {
			...productData,
			quantity: order.product_quantity,
			size: order.product_size,
		};
		let items = [];
		items.push(newObj);
		navigate("/shipping", { state: { selectedItems: items } });
	};
	const handleCancelOrder = (orderId) => {
		if (localStorage.getItem("auth-token")) {
			fetch(`http://localhost:3001/updateorderstatus`, {
				method: "POST",
				headers: {
					Accept: "application/form-data",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: orderId,
					status:"canceled",
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					alert("Đơn hàng đã được hủy!");
					window.location.reload();
				})
				.catch((error) => console.error("Lỗi khi hủy đơn:", error));
		}
	};
	if (!orders) {
		return <div>Loading...</div>;
	}
	return (
		<Container>
			<h3>Đơn hàng của tôi</h3>
			<HeaderTab>
				<TabOption
					data-active={selectedTab === "all"}
					onClick={() => handleTabClick("all")}
				>
					Tất cả đơn
				</TabOption>
				<TabOption
					data-active={selectedTab === "processing"}
					onClick={() => handleTabClick("processing")}
				>
					Đang xử lý
				</TabOption>
				<TabOption
					data-active={selectedTab === "inTransit"}
					onClick={() => handleTabClick("inTransit")}
				>
					Đang vận chuyển
				</TabOption>
				<TabOption
					data-active={selectedTab === "delivered"}
					onClick={() => handleTabClick("delivered")}
				>
					Đã giao
				</TabOption>
				<TabOption
					data-active={selectedTab === "canceled"}
					onClick={() => handleTabClick("canceled")}
				>
					Đã hủy
				</TabOption>
			</HeaderTab>
			<ListOrderWrapper>
				{orders.map((order, index) => (
					<OrderWrapper key={index}>
						<OrderHeader>
							{order.status === "delivered"
								? "Đã thanh toán"
								: "Chưa thanh toán"}
						</OrderHeader>

						{products && products.length > 0 ? (
							<OrderInfo>
								<ProductDetail>
									<img
										src={
											products.find(
												(product) => product.id === order.product_id
											).image
										}
									/>
									<ProductInfo>
										<div>
											{
												products.find(
													(product) => product.id === order.product_id
												).name
											}{" "}
										</div>
										<div>SL:x{order.product_quantity}</div>
									</ProductInfo>
								</ProductDetail>
								<ProductPrice>
									{
										products.find((product) => product.id === order.product_id)
											.new_price
									}{" "}
									đ
								</ProductPrice>
							</OrderInfo>
						) : (
							"Đang tải..."
						)}
						{products && products.length > 0 ? (
							<OrderFooter>
								<div>
									<div
										style={{
											display: "flex",
											justifyContent: "flex-end",
											marginBottom: "12px",
										}}
									>
										Tổng tiền:{" "}
										{order.shipping_method.fee +
											products.find(
												(product) => product.id === order.product_id
											).new_price *
												order.product_quantity}
										đ
									</div>
									<div
										style={{
											display: "flex",
											justifyContent: "flex-end",
											gap: "10px",
										}}
									>
										{selectedTab === "processing" && (
											<StyledButton
												onClick={() => handleCancelOrder(order._id)}
												style={{ color: "red", borderColor: "red" }}
											>
												Hủy đơn
											</StyledButton>
										)}
										<StyledButton
											onClick={() => {
												hanldeBuyAgain(
													products.find(
														(product) => product.id === order.product_id
													),
													order
												);
											}}
										>
											Mua lại
										</StyledButton>

										<StyledLink to={`/profile/customer/order/${order._id}`}>
											<StyledButton>Xem chi tiết</StyledButton>
										</StyledLink>
									</div>{" "}
								</div>
							</OrderFooter>
						) : (
							"Đang tải..."
						)}
					</OrderWrapper>
				))}
			</ListOrderWrapper>
		</Container>
	);
}

const Container = styled.div``;
const HeaderTab = styled.div`
	background: white;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
	height: 42px;
`;
const TabOption = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	color: #80808d;
	cursor: pointer;
	&[data-active="true"] {
    color: blue;
    font-weight: bold;
}
}

`;
const ListOrderWrapper = styled.div``;
const OrderWrapper = styled.div`
	background: white;
	height: 250px;
	display: grid;
	grid-template-rows: 1fr 4fr 2fr;
	margin: 20px 0;
	border-radius: 5px;
	padding: 20px;
`;
const OrderHeader = styled.div`
	border-bottom-width: 1px;
	border-bottom-style: solid;
	border-bottom-color: rgb(178, 178, 178);
`;
const OrderInfo = styled.div`
	display: flex;
	justify-content: space-between;
	border-bottom-width: 1px;
	padding: 16px 0;
	border-bottom-style: solid;
	border-bottom-color: rgb(178, 178, 178);
`;
const ProductDetail = styled.div`
	display: flex;
	img {
		height: 80px;
		width: 80px;
	}
`;
const ProductInfo = styled.div`
	margin: 0 12px;
`;
const ProductPrice = styled.div``;
const OrderFooter = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 12px;
`;

const StyledButton = styled.button`
	padding: 12px 8px;
	border-radius: 5px;
	border: 1px solid #0b74e5;
	background: none;
	cursor: pointer;
	color: #0b74e5;
`;
const StyledLink = styled(Link)`
	text-decoration: none;
	color: inherit;
`;
