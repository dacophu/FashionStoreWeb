import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import Order from "./Order";
import { FaStar } from "react-icons/fa";

export default function OrderDetail() {
	const { id } = useParams();
	const [detailOrder, setDetailOrder] = useState();
	const [userInfo, setUserInfo] = useState();
	const [product, setProduct] = useState();
	const [showReviewPopup, setShowReviewPopup] = useState(false);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	useEffect(() => {
		fetch(`http://localhost:3001/getorder/${id}`)
			.then((response) => response.json())
			.then((data) => {
				setDetailOrder(data[0]);
				fetch(`http://localhost:3001/product/${data[0].product_id}`)
					.then((response) => response.json())
					.then((productdata) => {
						setProduct(productdata[0]);
					});
			});
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
				});
		}
	}, []);

	const openReviewPopup = () => setShowReviewPopup(true);
	const closeReviewPopup = () => setShowReviewPopup(false);

	const handleRating = (index) => {
		setRating(index + 1);
	};

	const handleSendReview = () => {
		if (localStorage.getItem("auth-token")) {
			fetch("http://localhost:3001/sendreview", {
				method: "POST",
				headers: {
					Accept: "application/form-data",
					"auth-token": `${localStorage.getItem("auth-token")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					product_id: product.id,
					rating: rating,
					comment: comment,
				}),
			}).then((response) => {
				if (response.ok) {
					alert("Thêm đánh giá thành công");
					closeReviewPopup();
				}
			});
		}
	};

	if (!detailOrder) return <div>loading..</div>;
	return (
		<Container>
			<h3>Chi tiết đơn hàng {detailOrder._id}</h3>
			<HeaderWrapper>
				<HeaderItem>
					<HeaderItemTitle>Chi tiết người nhận</HeaderItemTitle>
					{userInfo ? (
						<HeaderItemContent>
							<div
								style={{
									fontSize: "18px",
									fontWeight: "550",
									marginBottom: "10px",
								}}
							>
								{userInfo.name}
							</div>
							<div style={{ marginBottom: "10px" }}>
								Địa chỉ: {detailOrder.address}
							</div>
							<div>Số điện thoại :{userInfo.phone}</div>
						</HeaderItemContent>
					) : (
						"Loading"
					)}
				</HeaderItem>
				<HeaderItem>
					<HeaderItemTitle>Hình thức giao hàng</HeaderItemTitle>
					<HeaderItemContent>
						<div style={{ marginBottom: "10px" }}>
							{detailOrder.shipping_method.name}
						</div>
						<div>Phí vận chuyển: {detailOrder.shipping_method.fee} đ</div>
					</HeaderItemContent>
				</HeaderItem>
				<HeaderItem>
					<HeaderItemTitle>Hình thức thanh toán</HeaderItemTitle>
					<HeaderItemContent>Thanh toán khi nhận hàng</HeaderItemContent>
				</HeaderItem>
			</HeaderWrapper>
			{product ? (
				<OrderWrapper>
					<ProductOrder>
						<ProductOrderHeader>
							<div>Sản phẩm</div>
							<div>Giá</div>
							<div>Số lượng</div>
							<div>Giảm giá</div>
							<div>Tạm tính</div>
						</ProductOrderHeader>
						<ProductOrderContent>
							<ProductOrderInfo>
								<img src={product.image} alt="" />
								<div>{product.name}</div>
							</ProductOrderInfo>
							<div>
								{product.old_price} <u>đ</u>
							</div>
							<div>{detailOrder.product_quantity}</div>
							<div>
								{product.old_price - product.new_price} <u>đ</u>
							</div>
							<div>
								{product.new_price} <u>đ</u>
							</div>
						</ProductOrderContent>
						<StyledButton onClick={openReviewPopup}>Viết nhận xét</StyledButton>
					</ProductOrder>

					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
						}}
					>
						<div style={{ width: "250px" }}>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<span>Tạm tính</span>
								<span style={{ float: "right" }}>
									{product.old_price} <u>đ</u>
								</span>
							</div>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<span>Phí vận chuyển</span>
								<span style={{ float: "right" }}>
									{detailOrder.shipping_method.fee} <u>đ</u>
								</span>
							</div>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<span>Giảm giá vận chuyển</span>
								<span style={{ float: "right" }}>
									-5.000 <u>đ</u>
								</span>
							</div>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<span>Giảm giá</span>
								<span style={{ float: "right" }}>
									-{product.old_price - product.new_price} <u>đ</u>
								</span>
							</div>
							<div
								style={{
									marginTop: "5px",
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<span>Tổng cộng</span>
								<span style={{ float: "right", color: "red" }}>
									{detailOrder.total} <u>đ</u>
								</span>
							</div>
						</div>
					</div>
				</OrderWrapper>
			) : (
				"Loading"
			)}

			{showReviewPopup && (
				<PopupOverlay>
					<PopupContent>
						<h3>Viết nhận xét</h3>
						<ProductRatingWrapper>
							<img src={product.image} alt="" />
							<ProductInfoRating>
								<div>{product.name}</div>
								<div
									style={{
										display: "flex",
										gap: "5px",
										marginBottom: "10px",
									}}
								>
									{[...Array(5)].map((_, index) => (
										<FaStar
											key={index}
											size={30}
											color={index < rating ? "#FFD700" : "#ccc"}
											style={{ cursor: "pointer" }}
											onClick={() => handleRating(index)}
										/>
									))}
								</div>
							</ProductInfoRating>
						</ProductRatingWrapper>

						<textarea
							placeholder="Nhập nhận xét của bạn..."
							rows="5"
							onChange={(e) => setComment(e.target.value)}
						></textarea>
						<div>
							<button onClick={closeReviewPopup}>Hủy</button>
							<button onClick={handleSendReview}>Gửi</button>
						</div>
					</PopupContent>
				</PopupOverlay>
			)}
		</Container>
	);
}

const Container = styled.div`
	height: auto;
`;
const HeaderWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 20px;
	height: 200px;
`;
const HeaderItem = styled.div`
	height: 100px;
`;
const HeaderItemTitle = styled.div`
	margin-bottom: 15px;
`;
const HeaderItemContent = styled.div`
	height: 100%;
	border-radius: 5px;
	background: white;
	padding: 15px;
`;

const OrderWrapper = styled.div`
	border-radius: 5px;
	background: white;
	padding: 15px;
`;
const ProductOrder = styled.div``;
const ProductOrderHeader = styled.div`
	display: grid;
	grid-template-columns: 5fr 1fr 1fr 1fr 1fr;
	margin-bottom: 15px;
`;
const ProductOrderContent = styled.div`
	display: grid;
	grid-template-columns: 5fr 1fr 1fr 1fr 1fr;
`;
const ProductOrderInfo = styled.div`
	display: flex;
	gap: 10px;
	img {
		width: 100px;
		height: 100px;
	}
`;
const StyledButton = styled.button`
	padding: 12px 8px;
	border-radius: 5px;
	border: 1px solid #0b74e5;
	background: none;
	cursor: pointer;
	color: #0b74e5;
`;
const PopupOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
`;

const PopupContent = styled.div`
	background: white;
	padding: 20px;
	border-radius: 8px;
	width: 600px;
	text-align: center;
	textarea {
		width: 80%;
		padding: 10px;
		margin: 10px 0;
	}
	button {
		padding: 10px;
		margin: 5px;
		border: none;
		cursor: pointer;
	}
`;

const ProductRatingWrapper = styled.div`
	display: flex;
	img {
		width: 70px;
		height: 70px;
	}
`;
const ProductInfoRating = styled.div`
	display: grid;
	padding: 10px;
	align-items: center;
`;
