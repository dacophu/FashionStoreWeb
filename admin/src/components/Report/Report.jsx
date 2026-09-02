import React, { useState, useEffect } from "react";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
	Legend,
} from "recharts";
import "./Report.css";

export default function Report() {
	const [allOrders, setAllOrders] = useState([]);
	const [allProducts, setAllProducts] = useState([]);
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [orderCountThisMonth, setOrderCountThisMonth] = useState(0);

	useEffect(() => {
		// Lấy danh sách đơn hàng
		fetch("http://localhost:3001/getallorder", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: "",
		})
			.then((response) => response.json())
			.then((data) => {
				setAllOrders(data);
				calculateStats(data);
			});

		// Lấy danh sách sản phẩm
		fetch("http://localhost:3001/allproducts")
			.then((response) => response.json())
			.then((data) => {
				setAllProducts(data);
			});
	}, []);

	// Tính tổng doanh thu và số đơn hàng trong tháng
	const calculateStats = (orders) => {
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth() + 1;
		const currentYear = currentDate.getFullYear();

		let total = 0;
		let count = 0;

		orders.forEach((order) => {
			total += order.total;

			const orderDate = new Date(order.book_date);
			const orderMonth = orderDate.getMonth() + 1;
			const orderYear = orderDate.getFullYear();

			if (orderMonth === currentMonth && orderYear === currentYear) {
				count += 1;
			}
		});

		setTotalRevenue(total);
		setOrderCountThisMonth(count);
	};

	// Xử lý dữ liệu doanh thu theo tháng
	const processRevenueData = () => {
		const revenueByMonth = Array.from({ length: 12 }, (_, i) => ({
			month: (i + 1).toString(),
			revenue: 0,
		}));

		allOrders.forEach((order) => {
			const date = new Date(order.book_date);
			const monthIndex = date.getMonth();

			revenueByMonth[monthIndex].revenue += order.total;
		});

		return revenueByMonth;
	};

	// Xử lý dữ liệu tỷ lệ mua của từng loại sản phẩm
	const processCategoryData = () => {
		const categoryCount = {};

		allOrders.forEach((order) => {
			const product = allProducts.find((p) => p.id === order.product_id);
			if (product) {
				categoryCount[product.category] =
					(categoryCount[product.category] || 0) + 1;
			}
		});

		// Chuyển đổi sang dạng phù hợp với PieChart
		return Object.keys(categoryCount).map((category) => ({
			name: category,
			value: categoryCount[category],
		}));
	};

	// Màu sắc cho PieChart
	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

	return (
		<div className="container">
			<h1>Báo cáo thống kê</h1>
			<div className="report_wrapper">
				<div className="analysis_overview">
					<div className="analysis_overview-item" style={{ background: "#A1BF9B" ,fontWeight:'600',color:'#21630e'}}>
						Tổng doanh thu: {totalRevenue.toLocaleString()} VND
					</div>
					<div className="analysis_overview-item" style={{ background: "#C09A99" ,fontWeight:'600',color:'#793839'}}>
						Số đơn hàng trong tháng: {orderCountThisMonth}
					</div>
				</div>

				<div className="list-chart">
					<div className="chart-item">
						<h4 >Doanh thu theo tháng</h4>
						<ResponsiveContainer  height={300} width={500}>
							<LineChart
								data={processRevenueData()}
								margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />
								<Line
									type="monotone"
									dataKey="revenue"
									stroke="#82ca9d"
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>

					<div className="chart-item">
						<h4 style={{fontWeight:'bold'}}>Tỷ lệ mua theo danh mục sản phẩm</h4>
						<ResponsiveContainer  height={300} width={300}>
							<PieChart>
								<Pie
									data={processCategoryData()}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={100}
									label
								>
									{processCategoryData().map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	);
}
