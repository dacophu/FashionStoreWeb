import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import bagBannerImg from "../assets/bagBanner.jpg";
import watchBannerImg from "../assets/watchBanner.jpg";
import trangsucBannerImg from "../assets/trangsucBanner.jpg";
import watchCol from "../assets/watchCol.png";
import bagCol from "../assets/bagCol.png";
import aonamCol from "../assets/aonamCol.png";
import aonuCol from "../assets/aonuCol.png";
import quannuCol from "../assets/quannuCol.png";
import quannamCol from "../assets/quannamCol.png";
import trangsucCol from "../assets/trangsucCol.png";
import vi from "../assets/vi.png";

export default function Home() {
	const [all_products, setAll_Products] = useState([]);
	const [collections, setCollections] = useState([
		{ category: "Áo nam", image: aonamCol },
		{ category: "Quần nam", image: quannamCol },
		{ category: "Đồng hồ", image: watchCol },
		{ category: "Áo nữ", image: aonuCol },
		{ category: "Quần nữ", image: quannuCol },
		{ category: "Túi xách", image: bagCol },
		{ category: "Trang sức", image: trangsucCol },
		{ category: "Ví", image: vi },
	]);

	useEffect(() => {
		fetch("http://localhost:3001/allproducts")
			.then((response) => response.json())
			.then((data) => {
				setAll_Products(data);
			});
	}, []);

	const filteredWatches = all_products
	.filter(product => product.category === "Đồng hồ")
	.slice(0, 8);

	const filteredTrangSucs = all_products
	.filter(product => product.category === "Trang sức")
	.slice(0, 8);
	return (
		<Container>
			<BannerWrapper>
				<img src={bagBannerImg} alt="Bag Banner" />
			</BannerWrapper>

			<Grid>
				{collections.map((collection, index) => (
					<CardWrapper key={index}>
						<StyledLink to="/search" state={{ category: collection.category }}>
							<Card>
								<ImageWrapper>
									<Card.Img variant="top" src={collection.image} />
								</ImageWrapper>
								<Card.Body>
									<CardTitle>{collection.category}</CardTitle>
								</Card.Body>
							</Card>
						</StyledLink>
					</CardWrapper>
				))}
			</Grid>

			<BannerWrapper>
				<img src={watchBannerImg} alt="Watch Banner" />
			</BannerWrapper>

			{/* Grid hiển thị sản phẩm "Đồng hồ" */}
			{filteredWatches.length > 0 && (
				<>
					<Title>Đồng hồ</Title>
					<Grid>
						{filteredWatches.map((product) => (
							<CardWrapper key={product.id}>
								<StyledLink to={`/product/${product.id}`}>
									<Card>
										<ImageWrapper>
											<Card.Img variant="top" src={product.image} />
										</ImageWrapper>
										<Card.Body>
											<CardTitle>{product.name}</CardTitle>
										</Card.Body>
									</Card>
								</StyledLink>
							</CardWrapper>
						))}
					</Grid>
				</>
			)}
			
			<BannerWrapper>
				<img src={trangsucBannerImg} alt="Trang suc Banner" />
			</BannerWrapper>

			{filteredTrangSucs.length > 0 && (
				<>
					<Title>Trang sức</Title>
					<Grid>
						{filteredTrangSucs.map((product) => (
							<CardWrapper key={product.id}>
								<StyledLink to={`/product/${product.id}`}>
									<Card>
										<ImageWrapper>
											<Card.Img variant="top" src={product.image} />
										</ImageWrapper>
										<Card.Body>
											<CardTitle>{product.name}</CardTitle>
										</Card.Body>
									</Card>
								</StyledLink>
							</CardWrapper>
						))}
					</Grid>
				</>
			)}
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0;
	max-width: 100%;
	height: auto;
	min-height: 100vh;
`;

const BannerWrapper = styled.div`
	max-width: 100%;
	img {
		width: 100%;
	}
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
	gap: 10px;
	width: 80%;
	margin: 0 auto;
`;

const CardWrapper = styled.div`
	display: flex;
	justify-content: center;
`;

const StyledLink = styled(Link)`
	text-decoration: none;
	color: inherit;
`;

const ImageWrapper = styled.div`
	width: 100%;
	height: 450px;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

const CardTitle = styled(Card.Title)`
	text-align: center;
	font-size: 16px;
	font-weight: 400;
	font-family: Helvetica Neue;
	color: #333;
`;

const Title = styled.h2`
	text-align: center;
	margin: 20px 0;
	font-size: 24px;
	color: #333;
`;

