import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SampleImage from "../assets/Sample.jpg";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function CartPage() {
	const [items, setItems] = useState([]);
	useEffect(() => {
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
					let newItems = [];
					console.log("Cart Data: ", cartData);
					const fetchProductDataPromises = cartData.map((cartItem, i) => {
						if (cartItem.length >= 1) {
							return fetch(`http://localhost:3001/product/${i}`)
								.then((response) => response.json())
								.then((productData) => {
									console.log(`Product ${i} data`);
									console.log(productData[0]);

									let sizeCount = {};

									cartItem.forEach((size) => {
										sizeCount[size] = (sizeCount[size] || 0) + 1;
									});

									let result = Object.keys(sizeCount).map((size) => ({
										size: size,
										quantity: sizeCount[size],
									}));

									result.forEach((res) => {
										let newObj = {
											...productData[0],
											quantity: res.quantity,
											size: res.size,
										};
										newItems.push(newObj);
									});
								});
						}
					});

					Promise.all(fetchProductDataPromises).then(() => {
						newItems = newItems.map((item) => ({
							...item,
							isSelected: item.isSelected ?? false, // Đảm bảo giá trị mặc định là false
						}));
						setItems(newItems); // Cập nhật items khi tất cả fetch hoàn tất
						console.log("Items", newItems);
					});
				})
				.catch((error) => {
					console.error("Error fetching cart data:", error);
				});
		}
	}, []);
	const handleRemoveProduct = (itemId, sizetomove) => {
		const updateItems = items.filter((item) => item.id !== itemId);
		setItems(updateItems);

		if (localStorage.getItem("auth-token")) {
			fetch("http://localhost:3001/removefromcart", {
				method: "POST",
				headers: {
					Accept: "application/form-data",
					"auth-token": `${localStorage.getItem("auth-token")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					itemId: itemId,
					size: sizetomove,
				}),
			})
				.then((response) => response.json())
				.then((data) => console.log(data));
		}
	};

	const handleQuantityChange = (itemId, action) => {
		setItems((preItems) =>
			preItems.map((item) =>
				item.id === itemId
					? {
							...item,
							quantity:
								action === "increment"
									? item.quantity + 1
									: Math.max(1, item.quantity - 1),
					  }
					: item
			)
		);
	};

	const handleSelectAll = (event) => {
		const isChecked = event.target.checked;
		setItems((prevItems) =>
			prevItems.map((item) => ({
				...item,
				isSelected: isChecked,
			}))
		);
	};

	const handleSelectItem = (itemId, size) => {
		setItems((prevItems) =>
			prevItems.map((item) =>
				item.id === itemId && item.size === size
					? {
							...item,
							isSelected: !item.isSelected,
					  }
					: item
			)
		);
	};
	const handleRemoveSelectedProducts = async () => {
		const updatedItems = items.filter((item) => !item.isSelected);
		const itemToRemoves = items.filter((item) => item.isSelected);
		setItems(updatedItems);

		if (localStorage.getItem("auth-token")) {
			for (const itemToRemove of itemToRemoves) {
				try {
					const response = await fetch("http://localhost:3001/removefromcart", {
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
					});
					const data = await response.json();
					console.log(data);
				} catch (error) {
					console.error("Error removing item:", error);
				}
			}
		}
	};
	
	const navigate = useNavigate();

	const handleCheckout = () => {
		const selectedItems = items.filter((item) => item.isSelected);
		navigate("/shipping", { state: { selectedItems } });
	};

	return (
		<Container>
			<CartSection>
				<SelectAllContainer>
					<input
						type="checkbox"
						onChange={handleSelectAll}
						checked={items.every((item) => item.isSelected)}
						style={{ width: "20px", height: "20px" }}
					/>
					Chọn tất cả
					<FaRegTrashCan
						style={{ cursor: "pointer", paddingLeft: "750px" }}
						onClick={handleRemoveSelectedProducts}
					/>
				</SelectAllContainer>
				<div className="ListItemContainer">
					{items.map((item) => (
						<CartItem key={`${item.id}-${item.size}`}>
							<ItemColumn style={{ gap: "0 10px", alignItems: "center" }}>
								<input
									type="checkbox"
									checked={item.isSelected}
									onChange={() => handleSelectItem(item.id, item.size)}
									style={{ width: "20px", height: "20px" }}
								/>
								<StyledLink to={`/product/${item.id}`}>
									<img src={item.image} alt={item.name} />
								</StyledLink>
							</ItemColumn>
							<ItemColumn
								style={{ flex: 2, flexDirection: "column", padding: "0 20px" }}
							>
								<StyledLink to={`/product/${item.id}`}>
									<h3 style={{ margin: "0" }}>{item.name}</h3>

									<p>Size: {item.size}</p>
								</StyledLink>
							</ItemColumn>
							<ItemColumn style={{ flex: 1, flexDirection: "column" }}>
								<strong>{item.new_price} VND</strong>
								<FaRegTrashCan
									style={{ cursor: "pointer" }}
									onClick={() => handleRemoveProduct(item.id, item.size)}
								/>
							</ItemColumn>
							<ItemColumn style={{ justifyContent: "Center" }}>
								<QuantityContainer>
									<button
										onClick={() => handleQuantityChange(item.id, "decrement")}
									>
										-
									</button>
									<span>{item.quantity}</span>
									<button
										onClick={() => handleQuantityChange(item.id, "increment")}
									>
										+
									</button>
								</QuantityContainer>
							</ItemColumn>
						</CartItem>
					))}
				</div>
			</CartSection>

			<CheckoutSection>
				<h2>Thanh toán</h2>
				{/* <StyledLink to={`/shipping/`}> */}
					<button onClick={handleCheckout}>Tiến hành đặt hàng</button>
				{/* </StyledLink> */}
			</CheckoutSection>
		</Container>
	);
}

const Container = styled.div`
	display: grid;
	grid-template-columns: 2fr 1fr;
	padding: 20px;
	gap: 30px;
	align-items: flex-start;
`;

const CartSection = styled.div`
	background: #fff;
	.ListItemContainer {
		background-color: #f4f4f4;

		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		padding: 0 20px;
	}
`;

const SelectAllContainer = styled.div`
	margin-bottom: 20px;
	display: flex;
	padding: 0 20px;
	align-items: center;
	gap: 0 10px;
	background-color: #f4f4f4;

	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CartItem = styled.div`
	height: 150px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 0;
	border-bottom: 1px solid #ddd;
`;

const ItemColumn = styled.div`
	height: 100%;
	flex: 1;
	display: flex;

	img {
		width: 150px;
		height: 150px;
		object-fit: cover;
		border-radius: 8px;
	}
`;

const QuantityContainer = styled.div`
	display: flex;
	gap: 10px;

	button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 30px;
		height: 30px;
		font-size: 1.2rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		cursor: pointer;

		&:hover {
			background-color: #f1f1f1;
		}
	}

	span {
		font-size: 1.2rem;
		font-weight: bold;
	}
`;

const CheckoutSection = styled.div`
	background: #fff;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	text-align: center;

	button {
		background: #e44d26;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 1rem;
		margin-top: 10px;

		&:hover {
			background: #c0392b;
		}
	}
`;
const StyledLink = styled(Link)`
	text-decoration: none;
	color: inherit;
`;
