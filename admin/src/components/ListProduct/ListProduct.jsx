import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import removeIcon from "../../assets/removeicon.png";
export default function () {
	const [allproducts, setAllProducts] = useState([]);

	const fetchInfo = async () => {
		await fetch("http://localhost:3001/allproducts")
			.then((res) => res.json())
			.then((data) => {
				setAllProducts(data);
			});
	};

	useEffect(() => {
		fetchInfo();
	}, []);

  const remove_product= async(id)=>{
    await fetch("http://localhost:3001/removeproduct",{
      method:'POST',
      headers:{
        Accept:'application/json',
        "Content-Type": "application/json",
      },
      body:JSON.stringify({id:id})
    })
    await fetchInfo();
	alert('Xóa sản phẩm thành công');
    
  }
	return (
		<div className="list-product">
			<h1> Danh sách sản phẩm</h1>
			<div className="listproduct-format-main">
				<p>Sản phẩm</p>
				<p>Tên sản phẩm</p>
				<p>Giá cũ</p>
				<p>Giá mới</p>
				<p>Loại</p>
				<p>Xóa</p>
			</div>
			<div className="listproduct-allproducts">
				<hr />
				{allproducts.map((product, index) => {
					return (
						<>
							<div
								key={index}
								className="listproduct-format-main listproduct-format"
							>
								<img
									src={product.image}
									alt=""
									className="listproduct-product-icon"
								/>
								<p>{product.name}</p>
								<p>{product.old_price} đ</p>
								<p>{product.new_price} đ</p>
								<p>{product.category}</p>
								<img onClick={()=>{remove_product(product.id)}}
									className="listproduct-remove-icon"
									src={removeIcon}
									alt=""
								/>
							</div>
							<hr />
						</>
					);
				})}
			</div>
		</div>
	);
}
