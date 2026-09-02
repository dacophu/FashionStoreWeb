import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.png";

export default function AddProduct() {
	const [image, setImage] = useState(false);
	const [productDetails, setProductDetails] = useState({
		name: "",
		image: "",
		category: "Áo nữ",
		new_price: "",
		old_price: "",
		size: "",
	});
	const imageHandler = (e) => {
		setImage(e.target.files[0]);
	};
	const chanceHandler = (e) => {
		setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
	};
	const Add_Product = async () => {
		console.log(productDetails);

		let responseData;
		let product = productDetails;

		let formData = new FormData();
		formData.append("product", image);
		await fetch("http://localhost:3001/upload", {
			method: "POST",
			headers: {
				Accept: "Application.json",
			},
			body: formData,
		})
			.then((resp) => resp.json())
			.then((data) => {
				responseData = data;
			});

		if (responseData.success) {
			product.image = responseData.image_url;
			console.log(product);
			await fetch("http://localhost:3001/addproduct", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(product),
			})
				.then((resp) => resp.json())
				.then((data) => {
					data.success ? alert("Đã thêm sản phẩm") : alert("Thêm thất bại");
				});
		}
	};

	//
	const [images, setImages] = useState([]);
	const [imageUrls, setImageUrls] = useState([]);

	const handleUpload = async () => {
		if (images.length === 0) {
			alert("Vui lòng chọn ít nhất một ảnh");
			return;
		}

		let formData = new FormData();
		for (let i = 0; i < images.length; i++) {
			formData.append("products", images[i]);
		}

		await fetch("http://localhost:3001/upload-multiple", {
			method: "POST",
			body: formData,
		})
			.then((resp) => resp.json())
			.then((data) => {
				if (data.success) {
					setImageUrls(data.image_urls);
					alert("Upload thành công!");
				} else {
					alert("Upload thất bại!");
				}
			})
			.catch((err) => {
				console.error(err);
				alert("Lỗi khi upload ảnh");
			});
	};
	//

	const [file, setFile] = useState(null);

	const handleUploadFile = async () => {
		if (!file) {
			alert("Vui lòng chọn file Excel");
			return;
		}

		let formData = new FormData();
		formData.append("file", file);
		await fetch("http://localhost:3001/addlistproduct", {
			method: "POST",
			body: formData,
		})
			.then((resp) => resp.json())
			.then((data) => {
				alert(data.message);
			})
			.catch((err) => {
				console.error(err);
				alert("Lỗi khi upload file Excel");
			});
	};
	return (
		<div className="container">
			<div className="add-product">
				<div className="addproduct-itemfield">
					<p>Tên sản phẩm</p>
					<input
						value={productDetails.name}
						onChange={chanceHandler}
						type="text"
						name="name"
						placeholder="Nhập tên sản phẩm"
					/>
				</div>
				<div className="addproduct-price">
					<div className="addproduct-itemfield">
						<p>Giá</p>
						<input
							value={productDetails.old_price}
							onChange={chanceHandler}
							type="text"
							name="old_price"
							placeholder="Nhập giá"
						/>
					</div>
					<div className="addproduct-itemfield">
						<p>Giá mới</p>
						<input
							value={productDetails.new_price}
							onChange={chanceHandler}
							type="text"
							name="new_price"
							placeholder="Nhập giá mới"
						/>
					</div>
				</div>
				<div className="addproduct-itemfield">
					<p>Loại sản phẩm</p>
					<select
						value={productDetails.category}
						onChange={chanceHandler}
						name="category"
						className="add-product-selector"
					>
						<option value="Túi xách">Túi xách</option>
						<option value="belt">Thắt lưng</option>
						<option value="hat">Mũ</option>
						<option value="sandal">Dép</option>
						<option value="shoe">Giày</option>
						<option value="Đồng hồ">Đồng hồ</option>
						<option value="Áo nam">Áo nam</option>
						<option value="Áo nữ">Áo nữ</option>
						<option value="Quần nam">Quần nam</option>
						<option value="Quần nữ">Quần nữ</option>
					</select>
				</div>
				<div className="addproduct-itemfield">
					<label htmlFor="file-input">
						<img
							src={image ? URL.createObjectURL(image) : upload_area}
							className="addproduct-thumbnail-img"
						/>
					</label>
					<input
						onChange={imageHandler}
						type="file"
						name="image"
						id="file-input"
						hidden
					/>
				</div>
				<button
					onClick={() => {
						Add_Product();
					}}
					className="addproduct-btn"
				>
					Thêm
				</button>
			</div>
			<div>
				<input
					type="file"
					multiple
					accept="image/*"
					onChange={(e) => setImages(e.target.files)}
				/>
				<button onClick={handleUpload}>Upload Ảnh</button>
				<div>
					{imageUrls.map((url, index) => (
						<img key={index} src={url} alt={`Uploaded ${index}`} width="100" />
					))}
				</div>
				<input
					type="file"
					accept=".xlsx, .xls"
					onChange={(e) => setFile(e.target.files[0])}
				/>
				<button onClick={handleUploadFile}>Thêm</button>
			</div>
		</div>
	);
}
