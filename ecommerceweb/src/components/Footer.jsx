import React from "react";
import styled from "styled-components";

export default function Footer() {
	return (
		<FooterContainer>
			<FooterGrid>
				<FooterSection>
					<h2>TPV Fashion</h2>
					<p>Cung cấp thời trang cao cấp với phong cách hiện đại, tinh tế.</p>
					<p>Hotline: 0123 456 789</p>
					<p>Email: support@tpvfashion.com</p>
          
					<Address>Địa chỉ: 123 Nguyễn Văn A, Quận 1, TP.HCM</Address>
				</FooterSection>
				<FooterSection>
					<h3>Liên kết nhanh</h3>
					<ul>
						<li>
							<a href="#">Trang chủ</a>
						</li>
						<li>
							<a href="#">Sản phẩm</a>
						</li>
						<li>
							<a href="#">Giới thiệu</a>
						</li>
						<li>
							<a href="#">Liên hệ</a>
						</li>
					</ul>
				</FooterSection>
				<FooterSection>
					<h3>Hỗ trợ khách hàng</h3>
					<ul>
						<li>
							<a href="#">Chính sách đổi trả</a>
						</li>
						<li>
							<a href="#">Phương thức thanh toán</a>
						</li>
						<li>
							<a href="#">Chính sách bảo mật</a>
						</li>
						<li>
							<a href="#">Câu hỏi thường gặp</a>
						</li>
					</ul>
				</FooterSection>
				<FooterSection>
					<h3>Kết nối với chúng tôi</h3>
					<SocialLinks>
						<a href="#">Facebook</a>
						<a href="#">Instagram</a>
						<a href="#">Twitter</a>
					</SocialLinks>
				</FooterSection>
			</FooterGrid>
			<Copyright>&copy; 2024 TPV Fashion. All rights reserved.</Copyright>
		</FooterContainer>
	);
}

const FooterContainer = styled.footer`
	background-color: rgb(109, 111, 115);
	color: white;
	height: 100%;
	width: 100%;
`;

const FooterGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(1, 1fr);
	gap: 2rem;
	padding: 0 1.5rem;
	max-width: 1200px;
	margin: 0 auto;

	@media (min-width: 768px) {
		grid-template-columns: repeat(4, 1fr);
	}
`;

const FooterSection = styled.div`
	h2,
	h3 {
		font-size: 1.25rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}
	p,
	ul li {
		color: #a0aec0;
		margin-bottom: 0.5rem;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	ul li a {
		color: #a0aec0;
		text-decoration: none;
		transition: color 0.3s;
	}
	ul li a:hover {
		color: white;
	}
`;

const SocialLinks = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	a {
		color: #a0aec0;
		font-size: 1.25rem;
		transition: color 0.3s;
		text-decoration: none;
	}
	a:hover {
		color: white;
	}
`;

const Address = styled.p`
	color: #a0aec0;
	margin-top: 1rem;
`;

const Copyright = styled.div`
	text-align: center;
	color: #a0aec0;
	font-size: 0.875rem;
	margin-top: 2rem;
`;
