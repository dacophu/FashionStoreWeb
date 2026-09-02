import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import SampleImage from "../assets/Sample.jpg";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Card } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
export default function Product() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [DetailProduct, setDetailProduct] = useState({});
	const sizes = ["XL", "S", "M", "L"];
	const [SimilarProducts, setSimilarProducts] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [users, setUsers] = useState([]);
	useEffect(() => {
		fetch(`http://localhost:3001/product/${id}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data[0]);
				setDetailProduct(data[0]);
			});
		fetch(`http://localhost:3001/getreview/${id}`, {
			method: "POST",
			headers: {
				Accept: "application/form-data",
				"Content-Type": "application/json",
			},
			body: "",
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setReviews(data);
				fetch("http://localhost:3001/getalluser", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({}),
				})
					.then((response) => response.json())
					.then((userData) => {
						const filteredUsers = userData.filter((user) =>
							data.some((review) => review.customer_id === user._id)
						);
						console.log(filteredUsers);
						setUsers(filteredUsers);
					});
			});
	}, [id]);

	useEffect(() => {
		if (DetailProduct.category) {
			fetch("http://localhost:3001/allproducts")
				.then((response) => response.json())
				.then((data) => {
					console.log("Category: ", DetailProduct.category);
					let temp = data.filter(
						(product) => product.category === DetailProduct.category
					);
					setSimilarProducts(temp);
					console.log(temp);
				});
		}
	}, [DetailProduct.category]);

	const [selectedColor, setSelectedColor] = useState(null);
	const [selectedSize, setSelectedSize] = useState("");
	const [quantity, setQuantity] = useState(1);

	const handleColorSelect = (color) => {
		setSelectedColor(color);
	};

	const handleSizeSelect = (size) => {
		setSelectedSize(size);
		// setDetailProduct((prevDetailProduct) => ({
		// 	...prevDetailProduct,
		// 	size: size,
		//   }));
	};

	const handleQuantityChange = (e) => {
		const value = parseInt(e.target.value, 10);
		if (!isNaN(value) && value > 0) {
			setQuantity(value);
		}
	};

	const handleBuyNow = () => {
		if (DetailProduct.size && DetailProduct.size.length > 0) {
			if (!selectedSize) {
				alert("Vui lòng chọn kích thước!");
				return;
			}
		}

		let newObj = {
			...DetailProduct,
			quantity: quantity,
			size: selectedSize,
		};
		let items = [];
		items.push(newObj);
		navigate("/shipping", { state: { selectedItems: items } });
	};

	const handleAddToCart = () => {
		if (DetailProduct.size && DetailProduct.size.length > 0) {
			if (!selectedSize) {
				alert("Vui lòng chọn kích thước!");
				return;
			}
		}

		if (localStorage.getItem("auth-token")) {
			console.log("Quantity: " + quantity);

			fetch("http://localhost:3001/addtocart", {
				method: "POST",
				headers: {
					Accept: "application/form-data",
					"auth-token": `${localStorage.getItem("auth-token")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					itemId: id,
					size: selectedSize,
					quantity: quantity,
				}),
			})
				.then((response) => response.json())
				.then((data) => alert("Đã thêm sản phẩm vào giỏ hàng"));
		} else {
			alert("Vui lòng đăng nhập để mua hàng");
			navigate(`/login`);
		}
	};
	let widthProduct = 280;

	const [currentPage, setCurrentPage] = useState(1);
	const productsPerPage = Math.floor(1496 / widthProduct);
	const totalPages = Math.ceil(SimilarProducts.length / productsPerPage);

	const handleNext = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrev = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const startIndex = (currentPage - 1) * productsPerPage;
	const selectedProducts = SimilarProducts.slice(
		startIndex,
		startIndex + productsPerPage
	);
	const StarRating = ({ rating }) => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			stars.push(
				<FaStar
					key={i}
					color={i <= rating ? "#FFD700" : "#ccc"} // Màu vàng cho sao đầy, xám cho sao trống
					size={20}
				/>
			);
		}
		return <div style={{ display: "flex", gap: "3px" }}>{stars}</div>;
	};
	const averageRating =
		reviews.length > 0
			? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
			: 0;
	return (
		<Container>
			<ProductInfo>
				<ImageSection>
					<img src={DetailProduct.image} alt="Sample image" />
				</ImageSection>
				<InfoSection>
					<Title>{DetailProduct.name}</Title>
					<p>{DetailProduct.category}</p>

					<div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
						{[...Array(5)].map((_, i) => (
							<FaStar
								key={i}
								color={
									i <
									Math.round(
										reviews.reduce((acc, review) => acc + review.rating, 0) /
											reviews.length
									)
										? "#FFD700"
										: "#ccc"
								}
							/>
						))}
						<div>({reviews.length} đánh giá)</div>
					</div>
					<Price>
						{Math.floor(DetailProduct.new_price).toLocaleString("vi-VN")}{" "}
						<u>đ</u>
					</Price>

					{DetailProduct.size &&
						DetailProduct.size.length > 0 &&
						"Chọn kíchthước "}
					{DetailProduct.size && DetailProduct.size.length > 0 && (
						<Section>
							<MyLabel>Size</MyLabel>
							<SizeContainer>
								{DetailProduct.size.map((size, index) => (
									<SizeBox
										key={index}
										selected={selectedSize === size}
										onClick={() => handleSizeSelect(size)}
									>
										{size}
									</SizeBox>
								))}
							</SizeContainer>
						</Section>
					)}
					<Section>
						<MyLabel>Số lượng</MyLabel>
						<QuantityInput
							type="number"
							value={quantity}
							onChange={handleQuantityChange}
							min="1"
						/>
					</Section>
					<ButtonContainer>
						<BuyButton onClick={handleBuyNow}>Buy Now</BuyButton>
						<CartButton onClick={handleAddToCart}>Add to Cart</CartButton>
					</ButtonContainer>
				</InfoSection>
			</ProductInfo>
			<hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />
			<ReviewsContainer>
				<RatingContainer>
					{reviews.length > 0 ? (
						<>
							<div>
								<div
									style={{
										fontSize: "48px",
										fontWeight: "bold",
										display: "flex",
									}}
								>
									{(
										reviews.reduce((acc, review) => acc + review.rating, 0) /
										reviews.length
									).toFixed(1)}
									<div
										style={{
											color: "gray",
											fontSize: "30px",
											alignSelf: "end",
										}}
									>
										/5
									</div>
								</div>
							</div>
							{/* Hiển thị sao */}
							<div
								style={{ display: "flex", alignItems: "center", gap: "5px" }}
							>
								{[...Array(5)].map((_, i) => (
									<FaStar
										key={i}
										size={30}
										color={
											i <
											Math.round(
												reviews.reduce(
													(acc, review) => acc + review.rating,
													0
												) / reviews.length
											)
												? "#FFD700"
												: "#ccc"
										}
									/>
								))}
							</div>
							<div>({reviews.length} đánh giá)</div>
						</>
					) : (
						<p>Chưa có đánh giá nào.</p>
					)}
				</RatingContainer>
				<CommentContainer>
					{reviews.length > 0 && users.length > 0 ? (
						reviews.map((review, index) => {
							const user = users.find(
								(user) => user._id === review.customer_id
							);
							return (
								<CommentItem key={index}>
									<div style={{ display: "flex" }}>
										<div>{user?.name || "Người dùng ẩn danh"}</div>{" "}
										<StarRating rating={review.rating} />
									</div>
									<div>{review.comment}</div>
								</CommentItem>
							);
						})
					) : (
						<p>Chưa có đánh giá nào.</p>
					)}
				</CommentContainer>
			</ReviewsContainer>
			<hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />
			<ListSimilarContainer>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<h2>Sản phẩm tương tự</h2>
					Trang {currentPage}/{totalPages}
				</div>

				<ListSimilarProductsWrapper>
					<NavButton onClick={handlePrev} disabled={currentPage === 1}>
						<FaChevronLeft />
					</NavButton>
					<ListSimilarProducts>
						{selectedProducts.map((product, index) => (
							<StyledLink to={`/product/${product.id}`} key={index}>
								<SimilarProductCard>
									<Card.Img
										variant="top"
										src={product.image}
										alt={product.name}
										style={{ width: widthProduct }}
									/>
									<Card.Body
										style={{ display: "flex", flexDirection: "column" }}
									>
										<Card.Title>{product.name}</Card.Title>
										<Card.Text>${product.new_price}</Card.Text>
									</Card.Body>
								</SimilarProductCard>{" "}
							</StyledLink>
						))}
					</ListSimilarProducts>
					<NavButton onClick={handleNext} disabled={currentPage === totalPages}>
						<FaChevronRight />
					</NavButton>
				</ListSimilarProductsWrapper>
			</ListSimilarContainer>
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 80%;
	margin: 0 auto;
	padding: 20px 0;
`;
const ProductInfo = styled.div`
	width: 100%;
	display: grid;
	gap: 30px;
	grid-template-columns: 1fr 2fr;
`;
const ListSimilarContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
`;
const ImageSection = styled.div`
	img {
		width: 450px;
		border-radius: 10px;
	}
`;

const InfoSection = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const Title = styled.div`
	font-size: 1.5rem;
	font-weight: 400;
	font-family: Arial;
`;

const Price = styled.div`
	font-size: 1.2rem;
	color: #e44d26;
	font-weight: bold;
`;

const Section = styled.div`
	margin-top: 10px;
`;

const MyLabel = styled.div`
	font-size: 1rem;
	font-weight: bold;
	color: #666;
	margin-bottom: 5px;
`;

const ColorContainer = styled.div`
	display: flex;
	gap: 10px;
`;

const ColorBox = styled.div`
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background-color: ${(props) => props.color};
	border: ${(props) => (props.selected ? "3px solid #000" : "1px solid #ccc")};
	cursor: pointer;
	transition: 0.3s;

	&:hover {
		transform: scale(1.1);
	}
`;

const SizeContainer = styled.div`
	display: flex;
	gap: 10px;
`;

const SizeBox = styled.div`
	padding: 7px 15px;
	border: 1px solid #ccc;
	border-radius: 5px;
	cursor: pointer;
	font-size: 1rem;
	transition: 0.3s;
	background-color: ${(props) => (props.selected ? "#27ae60" : "transparent")};
	color: ${(props) => (props.selected ? "white" : "black")};
	border: ${(props) =>
		props.selected ? "2px solid #219150" : "1px solid #ccc"};

	&:hover {
		background-color: #ddd;
	}
`;

const QuantityInput = styled.input`
	width: 60px;
	padding: 5px;
	border: 1px solid #ccc;
	border-radius: 5px;
	text-align: center;
	font-size: 1rem;
`;

const ButtonContainer = styled.div`
	display: flex;
	gap: 15px;
	margin-top: 15px;
`;

const ButtonBase = styled.button`
	width: 140px;
	padding: 10px;
	border-radius: 5px;
	font-size: 1rem;
	font-weight: bold;
	cursor: pointer;
	transition: 0.3s;
	border: none;
`;

const BuyButton = styled(ButtonBase)`
	background-color: #e44d26;
	color: white;

	&:hover {
		background-color: #c0392b;
	}
`;

const CartButton = styled(ButtonBase)`
	background-color: #27ae60;
	color: white;

	&:hover {
		background-color: #219150;
	}
`;
const StyledLink = styled(Link)`
	text-decoration: none;
	color: inherit;
`;
const ListSimilarProductsWrapper = styled.div`
	display: flex;
	flex-direction: row;
	height: auto;
	align-items: center;
	justify-content: space-between;
`;

const NavButton = styled.button`
	width: 40px;
	height: 40px;
	cursor: pointer;
`;
const ListSimilarProducts = styled.div`
	display: flex;
	flex-direction: row;
	gap: 10px;
	justify-content: space-between;
`;
const SimilarProductCard = styled(Card)`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;
const ReviewsContainer = styled.div`
	padding: 0 20px;
`;
const RatingContainer = styled.div`
	margin-bottom: 40px;
`;
const CommentContainer = styled.div`
	margin-top: 10px;
`;
const CommentItem = styled.div`
	border-top-style: solid;
	border-top-color: rgba(145, 145, 145, 0.39);
`;
