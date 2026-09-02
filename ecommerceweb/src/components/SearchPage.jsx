import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SampleImage from "../assets/Sample.jpg";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";
export default function SearchPage() {
	const location = useLocation();
	const [allProduct, setAllProduct] = useState([]);
	const [searchResult, setSearchResult] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [sortOption, setSortOption] = useState("");
	const [reviews, setReviews] = useState([]);
	useEffect(() => {
		if (location.state?.category) {
			setSelectedCategory(location.state.category);
			const filteredProducts =
				location.state.category === "All"
					? allProduct
					: allProduct.filter(
							(product) => product.category === location.state.category
					  );
			setSearchResult(filteredProducts);
		}
	}, [location.state, allProduct]);

	useEffect(() => {
		fetch("http://localhost:3001/allproducts")
			.then((response) => response.json())
			.then((data) => {
				setAllProduct(data);
				const uniqueCategories = [
					"All",
					...new Set(data.map((product) => product.category)),
				];
				setCategories(uniqueCategories);
			});
		fetch("http://localhost:3001/getallreview", {
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
			});
	}, []);

	const handleSearch = (searchText) => {
		if (searchText.trim() === "") {
			setSearchResult(allProduct);
			return;
		}
		const filteredProducts = allProduct.filter((product) =>
			product.name.toLowerCase().includes(searchText.toLowerCase())
		);
		setSelectedCategory("All");
		setSearchResult(filteredProducts);
	};
	const handleFilter = (category) => {
		setSelectedCategory(category);
		if (category === "All") {
			setSearchResult(allProduct);
		} else {
			setSearchResult(
				allProduct.filter((product) => product.category === category)
			);
		}
	};
	const handleSort = (option) => {
		setSortOption(option);
		let sortedProducts = [...searchResult];

		if (option === "highToLow") {
			sortedProducts.sort((a, b) => b.new_price - a.new_price);
		} else if (option === "lowToHigh") {
			sortedProducts.sort((a, b) => a.new_price - b.new_price);
		}

		setSearchResult(sortedProducts);
	};
	return (
		<Container>
			<div className="search_bar">
				<input
					type="text"
					placeholder="Search in here"
					onChange={(e) => handleSearch(e.target.value)}
				/>
			</div>
			<SearchContentWrapper>
				<SearchFilter>
					<CategoryWrapper>
						{categories.map((category, index) => (
							<FilterButton
								key={index}
								active={selectedCategory === category}
								onClick={() => handleFilter(category)}
							>
								{category}
							</FilterButton>
						))}
					</CategoryWrapper>
					<SortSelect
						value={sortOption}
						onChange={(e) => handleSort(e.target.value)}
					>
						<option value="highToLow">Giá: Cao → Thấp</option>
						<option value="lowToHigh">Giá: Thấp → Cao</option>
					</SortSelect>
				</SearchFilter>
				<SearchResultWrapper>
					{searchResult.map((product, index) => (
						<StyledLink to={`/product/${product.id}`} key={index}>
							<ProductCard>
								<img src={product.image} />
								<div>
									<div style={{ color: "#FF4259", fontSize: "20px" }}>
										{Math.floor(product.new_price).toLocaleString("vi-VN")}{" "}
										{[...Array(5)].map((_, i) => {
											// Lọc review theo product_id
											const productReviews = reviews.filter(
												(review) => review.product_id === product.id
											);
											// Kiểm tra nếu có review thì tính trung bình, ngược lại mặc định là 0
											const avgRating =
												productReviews.length > 0
													? productReviews.reduce(
															(acc, review) => acc + review.rating,
															0
													  ) / productReviews.length
													: 0;

											return (
												<FaStar
													key={i}
													size={30}
													color={i < Math.round(avgRating) ? "#FFD700" : "#ccc"}
												/>
											);
										})}
									</div>
									<div style={{ fontSize: "16px" }}>{product.name}</div>
								</div>
							</ProductCard>
						</StyledLink>
					))}
				</SearchResultWrapper>
			</SearchContentWrapper>
		</Container>
	);
}
const Container = styled.div`
	justify-content: center;
	height: 100vh;
	background-color: white;
	.search_bar {
		justify-content: center;
		width: 100%;
		padding: 0.4rem 0.4 rem;
		gap: 0.5rem;
		display: flex;
		align-item: center;
		input {
			border-radius: 2rem;
			height: 50px;
			width: 80%;
			&:focus {
				outline: none;
			}
			font-size: 14px;
			padding: 4px 24px;
		}
	}
`;
const SearchContentWrapper = styled.div`
	overflow: hidden;
`;
const SearchFilter = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	padding: 10px 0;
	position: relative;
`;

const CategoryWrapper = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
`;
const FilterButton = styled.button`
	padding: 8px 12px;
	border: none;
	background-color: ${(props) => (props.active ? "#FF4259" : "#F5F5FA")};
	color: ${(props) => (props.active ? "white" : "black")};
	border-radius: 5px;
	cursor: pointer;
	transition: background 0.3s;
	&:hover {
		background-color: #ff4259;
		color: white;
	}
`;
const SearchResultWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 10px;
`;
const ProductCard = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 5px;
	background: #f5f5fa;
	border-radius: 10px;
	img {
		width: 450px;
		height: 450px;
		object-fit: cover;
		border-radius: 5px;
		margin-bottom: 8px;
	}
`;
const StyledLink = styled(Link)`
	text-decoration: none;
	color: inherit;
`;
const SortSelect = styled.select`
	position: absolute;
	top: 0;
	right: 0;
	padding: 8px 12px;
	border: 1px solid #ccc;
	border-radius: 5px;
	cursor: pointer;
	font-size: 14px;
	min-width: 180px;
`;
