import React, { useState, useEffect } from "react";
import "./Order.css";
export default function Order() {
	const [allOrders, setAllOrders] = useState();
	const [processingOrders, setProcessingOrders] = useState();
	const [inTransitOrders, setInTransitOrders] = useState();
	const [deliveredOrders, setDeliveredOrders] = useState();
	const [canceledOrders, setCanceledOrders] = useState();
	const [orders, setOrders] = useState();
	const [products, setProducts] = useState();
	const [users, setUsers] = useState();
	const [selectedTab, setSelectedTab] = useState("all");
    const fetchData=()=>{
        fetch("http://localhost:3001/getallorder", {
			method: "POST",
			headers: {
				Accept: "application/form-data",
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
				setCanceledOrders(data.filter((order) => order.status === "canceled"));
				setOrders(data);
				const uniqueProductIds = [
					...new Set(data.map((item) => item.product_id)),
				];
				const uniqueUserIds = [
					...new Set(data.map((item) => item.customer_id)),
				];
				const productData = await Promise.all(
					uniqueProductIds.map((productId) =>
						fetch(`http://localhost:3001/product/${productId}`)
							.then((response) => response.json())
							.then((product) => product[0])
					)
				);
				setProducts(productData);
				const userData = await Promise.all(
					uniqueUserIds.map((userId) =>
						fetch(`http://localhost:3001/getuserbyid`, {
							method: "POST",
							headers: {
								Accept: "application/form-data",
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								id: userId,
							}),
						})
							.then((response) => response.json())
							.then((user) => user)
					)
				);
				console.log(userData);
				setUsers(userData);
			});
    }
	useEffect(() => {
		fetchData();
	}, []);

	const handleChangeStatus = (orderId,status) => {
        console.log(orderId,status);
        fetch(`http://localhost:3001/updateorderstatus`, {
            method: "POST",
            headers: {
                Accept: "application/form-data",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: orderId,
                status:status,
            }),
        })
            .then((response) => response.json())
            .then((data)=>fetchData())
    };

	if (!orders) {
		return <div>loading</div>;
	}
	return (
		<div className="container">
			<h3>Danh sách đơn hàng</h3>
			<div className="list-order-wrapper">
				<div className="search-box"></div>
				<div className="content">
					<div className="list-order-header">
						<div>
							<input type="checkbox" />
						</div>
						<div>Mã đơn hàng</div>
						<div>Ngày đặt</div>
						<div>Khách hàng</div>
						<div>Số điện thoại</div>
						<div>Địa chỉ giao hàng</div>
						<div>Sản phẩm</div>
						<div>Tổng tiền</div>
						<div>Thanh toán</div>
						<div>Trạng thái</div>
					</div>
					{products &&
						products.length > 0 &&
						users &&
						users.length > 0 &&
						orders.map((order, index) => (
							<div className="order-item" key={index}>
								<div>
									<input type="checkbox" />
								</div>
								<div>{order._id}</div>
								<div>
									{new Date(order.book_date).toLocaleDateString("vi-VN")}
								</div>
								<div>
									{users.find((user) => user._id === order.customer_id).name}
								</div>
								<div>
									{" "}
									{users.find((user) => user._id === order.customer_id).phone}
								</div>
								<div>{order.address}</div>
								<div>
                                    {products.find(
												(product) => product.id === order.product_id
											).name},SL:{order.product_quantity}
                                </div>
								<div>
									 {Math.floor(
										order.shipping_method.fee +
											products.find(
												(product) => product.id === order.product_id
											).new_price*order.product_quantity
									).toLocaleString("vi-VN")} <u>đ</u> 
									{/* {Math.floor(
										order.total
									).toLocaleString("vi-VN")} <u>đ</u>  */}
								</div>
								<div>
									{order.status === "delivered"
										? "Đã thanh toán"
										: "Chưa thanh toán"}
								</div>
								<select value={order.status} onChange={(e) => handleChangeStatus(order._id,e.target.value)}>
									<option value="processing">Đang xử lý</option>
									<option value="inTransit">Đang vận chuyển</option>
									<option value="delivered">Đã giao</option>
									<option value="canceled">Đã hủy</option>
								</select>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
