import React from "react";
import Header from "./Header";
import Home from "./Home";
import styled from "styled-components";
import Product from "./Product";
import { Routes, Route } from "react-router-dom";
import CartPage from "./CartPage";
import Shipping from "./Shipping";
import SearchPage from "./SearchPage";
import LoginSignUp from "./LoginSignUp";
import Profile from "./Profile";
import Footer from "./Footer";
export default function () {
	return (
		<Container>
			<div className="header">
				<Header />
			</div>

			<div className="body">
				<div className="body__content">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/product/:id" element={<Product />} />
						<Route path="/cart/" element={<CartPage />} />
						<Route path="/shipping/" element={<Shipping />} />
						<Route path="/search/" element={<SearchPage />} />
						<Route path="/login" element={<LoginSignUp />} />
						<Route path="/profile/*" element={<Profile />} />
					</Routes>
				</div>
			</div>
			<div className="footer">
				<Footer />
			</div>
		</Container>
	);
}
const Container = styled.div`
	width: 100%;
	height: auto;
	overflow: hidden;
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 1000;

		height: 10vh;
	}
	.footer {
		width: 100%;
		height: 25vh;
		background-color:rgb(222, 222, 222);
		color: #fff; 
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1rem;
		position: relative; 
		bottom: 0;
	}

	.body {
		margin-top: 10vh;
		height: auto;
		min-height: 100vh;

		background-color: rgb(255, 255, 255);
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		overflow-y: auto;
		&::-webkit-scrollbar {
			width: 0.7rem;
			max-height: 2rem;
			&-thumb {
				background-color: rgba(241, 236, 236, 0.6);
			}
		}
	}
	.body__content {
		height: auto;
		min-height: 100vh;

		width: 100%;
		background: #f4f4f9;
	}
`;
