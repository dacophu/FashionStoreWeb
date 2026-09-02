require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const xlsx = require("xlsx");

const nodemailer = require('nodemailer');
const port = 3001;
app.use(express.json());
app.use(cors());
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass
    }
});
// database connection
mongoose
	.connect(process.env.URI)
	.then(() => {
		console.log("Connect db success");
	})
	.catch((err) => {
		console.log(err);
	});

app.get("/", (req, res) => {
	res.send("Express app is running");
});

// image storage
const storage = multer.diskStorage({
	destination: "./upload/images",
	filename: (req, file, cb) => {
		return cb(
			null,
			`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
		);
	},
});
const upload = multer({ storage: storage });

// creating upload endpoint image
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
	res.json({
		success: 1,
		image_url: `http://localhost:${port}/images/${req.file.filename}`,
	});
});
app.post("/upload-multiple", upload.array("products", 200), (req, res) => {
	if (!req.files || req.files.length === 0) {
		return res
			.status(400)
			.json({ success: false, message: "Vui lòng chọn ít nhất một ảnh!" });
	}

	const imageUrls = req.files.map(
		(file) => `http://localhost:${port}/images/${file.filename}`
	);

	res.json({
		success: true,
		image_urls: imageUrls,
	});
});

const Product = mongoose.model("Product", {
	id: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	new_price: {
		type: Number,
		required: true,
	},
	old_price: {
		type: Number,
		required: true,
	},
	size: {
		type: Array,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	available: {
		type: Boolean,
		default: true,
	},
});

// creating product
app.post("/addproduct", async (req, res) => {
	let products = await Product.find({});
	let id;
	if (products.length > 0) {
		let last_product_array = products.slice(-1);
		let last_product = last_product_array[0];
		id = last_product.id + 1;
	} else {
		id = 1;
	}
	const product = new Product({
		id: id,
		name: req.body.name,
		image: req.body.image,
		category: req.body.category,
		new_price: req.body.new_price,
		old_price: req.body.old_price,
		size: req.body.size,
	});
	console.log(product);
	await product.save();
	console.log("saved");
	res.json({
		success: true,
		name: req.body.name,
	});
});

const addlistproduct = multer({ storage: multer.memoryStorage() });
// creating product
app.post("/addlistproduct", addlistproduct.single("file"), async (req, res) => {
	try {
		if (!req.file) {
			return res
				.status(400)
				.json({ success: false, message: "Vui lòng upload file" });
		}

		// Đọc dữ liệu file Excel từ bộ nhớ
		const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
		const sheet_name = workbook.SheetNames[0];
		const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);

		let products = await Product.find({});
		let id = products.length > 0 ? products.slice(-1)[0].id + 1 : 1;

		// Duyệt qua từng sản phẩm trong file Excel và thêm vào database
		for (let row of data) {
			const product = new Product({
				id: id++,
				name: row.name,
				image: row.image, // Nếu ảnh là URL, cần đảm bảo đúng định dạng
				category: row.category,
				new_price: row.new_price,
				old_price: row.old_price,
				size: row.size ? row.size.split(",") : [],
			});
			await product.save();
		}

		res.json({ success: true, message: "Đã thêm sản phẩm từ file Excel" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Lỗi xử lý file Excel" });
	}
});
// creating api deleting product

app.post("/removeproduct", async (req, res) => {
	await Product.findOneAndDelete({ id: req.body.id });
	console.log("Removed");
	res.json({
		success: true,
		name: req.body.name,
	});
});

// creating api get all product
app.get("/allproducts", async (req, res) => {
	let products = await Product.find({});
	console.log("All products fetched");
	res.send(products);
});

// creating api get product by id
app.get("/product/:id", async (req, res) => {
	try {
		const productId = req.params.id;
		const product = await Product.find({ id: productId });

		if (!product) {
			return res.status(404).send({ message: "Product not found" });
		}

		console.log(`Product with id ${productId} fetched`);
		res.send(product);
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Error fetching product" });
	}
});

// creating user model
const Users = mongoose.model("User", {
	name: {
		type: String,
	},
	email: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
	},
	cartData: {
		type: Array,
		default: Array(300),
	},
	phone: {
		type: String,
		unique: true,
	},
	birthDate: {
		type: Date,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	address: {
		type: Object,
	},
	gender: {
		type: String,
		default: "Nam",
	},
});
// creating user
app.post("/signup", async (req, res) => {
	let check = await Users.findOne({ email: req.body.email });
	if (check) {
		return res.status(400).json({
			success: false,
			errors: "exiting user found with email address",
		});
	}
	let cart = [];
	for (let i = 0; i < 300; i++) {
		cart[i] = [];
	}
	let addressArr = [];

	let address = { default: 0, address: addressArr };
	const user = new Users({
		name: req.body.username,
		email: req.body.email,
		password: req.body.password,
		cartData: cart,
		phone: req.body.phone,
		birthDate: req.body.birthDate,
		address: address,
	});
	await user.save();
	const data = {
		user: {
			id: user.id,
		},
	};
	const token = jwt.sign(data, "secret_ecom");
	res.json({ success: true, token });
});

// creating user login api
app.post("/login", async (req, res) => {
	let user = await Users.findOne({ email: req.body.email });
	if (user) {
		const passCompare = req.body.password === user.password;
		if (passCompare) {
			const data = {
				user: {
					id: user.id,
				},
			};
			const token = jwt.sign(data, "secret_ecom");
			res.json({ success: true, token });
		} else {
			res.json({ success: false, errors: "Wrong password" });
		}
	} else {
		res.json({ success: false, errors: "Wrong email" });
	}
});

const fetchUser = async (req, res, next) => {
	const token = req.header("auth-token");
	if (!token) {
		res.status(401).send({ errors: "in valid token" });
	} else {
		try {
			const data = jwt.verify(token, "secret_ecom");
			req.user = data.user;
			next();
		} catch (error) {
			res.status(401).send({ errors: "in valid token" });
		}
	}
};
// creating api add to cart
app.post("/addtocart", fetchUser, async (req, res) => {
	let userData = await Users.findOne({ _id: req.user.id });
	let arr = userData.cartData[req.body.itemId];
	for (let i = 0; i < req.body.quantity; i++) {
		arr.push(req.body.size);
	}

	await Users.findOneAndUpdate(
		{ _id: req.user.id },
		{ cartData: userData.cartData }
	);
	res.json({ message: "Added successfully" });
});

// creating api remove product in cart
app.post("/removefromcart", fetchUser, async (req, res) => {
	let userData = await Users.findOne({ _id: req.user.id });
	let arr = userData.cartData[req.body.itemId];
	userData.cartData[req.body.itemId] = arr.filter(
		(size) => size !== req.body.size
	);

	await Users.findOneAndUpdate(
		{ _id: req.user.id },
		{ cartData: userData.cartData }
	);
	res.json({
		message: "Removed",
		sizetoremove: `${req.body.size}`,
		data: `${userData.cartData[req.body.itemId].filter(
			(size) => size !== req.body.size
		)}`,
	});
});

// creating api get products in cart
app.post("/getcart", fetchUser, async (req, res) => {
	let userData = await Users.findOne({ _id: req.user.id });
	res.json(userData.cartData);
});
// creating api get user
app.post("/getuser", fetchUser, async (req, res) => {
	let userData = await Users.findOne({ _id: req.user.id });
	res.json(userData);
});
app.post("/getalluser", async (req, res) => {
	let userData = await Users.find({});
	res.json(userData);
});
// creating api get user by id
app.post("/getuserbyid", async (req, res) => {
	let userData = await Users.findOne({ _id: req.body.id });
	res.json(userData);
});

// creating api update user
app.post("/updateuser", fetchUser, async (req, res) => {
	await Users.findOneAndUpdate(
		{ _id: req.user.id },
		{
			name: req.body.name,
			phone: req.body.phone,
			birthDate: req.body.birthDate,
			gender: req.body.gender,
		}
	);
	res.json({ message: "Update successful" });
});

// creating api update user
app.post("/createaddress", fetchUser, async (req, res) => {
	let userData = await Users.findOne({ _id: req.user.id });
	let address = userData.address;
	let addressArr = address.address;
	addressArr[addressArr.length] = req.body.address;
	if (req.body.isDefault) {
		address.default = addressArr.length - 1;
	}
	await Users.findOneAndUpdate({ _id: req.user.id }, { address: address });
	res.json({ message: "Update address successful" });
});

// creating api update address
app.post("/updateaddress", fetchUser, async (req, res) => {
	let userData = await Users.findOne({ _id: req.user.id });
	let address = userData.address;
	let addressArr = address.address;
	addressArr[req.body.index] = req.body.address;
	if (address.default != req.body.index && req.body.isDefault) {
		address.default = req.body.index;
	}
	await Users.findOneAndUpdate({ _id: req.user.id }, { address: address });
	res.json({ message: "Update address successful" });
});

// creating order model
const Orders = mongoose.model("Orders", {
	customer_id: {
		type: mongoose.Types.ObjectId,
	},
	product_id: {
		type: Number,
	},
	product_size: {
		type: String,
	},
	product_quantity: {
		type: Number,
	},
	address: {
		type: String,
	},
	book_date: {
		type: Date,
		default: Date.now,
	},
	delivery_date: {
		type: Date,
	},
	status: {
		type: String,
		default: "processing",
	},
	shipping_method: {
		type: Object,
	},
	total: {
		type: Number,
	},
});
// creating api create order
app.post("/createorder", fetchUser, async (req, res) => {
	let shipping_method = {
		name: req.body.shipping_method.name,
		fee: req.body.shipping_method.fee / req.body.product.length,
	};
	for (let i = 0; i < req.body.product.length; i++) {
		const order = new Orders({
			customer_id: req.user.id,
			product_id: req.body.product[i].id,
			product_size: req.body.product[i].size,
			product_quantity: req.body.product[i].quantity,
			address: req.body.address,
			delivery_date: req.body.delivery_date,
			shipping_method: shipping_method,
			total: req.body.total,
		});
		await order.save();
	}

	res.json({
		success: true,
	});
});

// creating api get order
app.post("/getorder", fetchUser, async (req, res) => {
	let orderData = await Orders.find({ customer_id: req.user.id });
	res.json(orderData);
});

app.post("/getallorder", async (req, res) => {
	let orderData = await Orders.find({});
	res.json(orderData);
});

app.get("/getorder/:id", async (req, res) => {
	try {
		const orderId = req.params.id;
		const order = await Orders.find({ _id: orderId });

		if (!order) {
			return res.status(404).send({ message: "Order not found" });
		}
		res.send(order);
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Error fetching order" });
	}
});

// creating api update order status
app.post("/updateorderstatus", async (req, res) => {
	await Orders.findOneAndUpdate(
		{ _id: req.body.id },
		{ status: req.body.status }
	);
	res.json({ message: "Update order successful" });
});

// creating Review model
const Review = mongoose.model("Review", {
	product_id: {
		type: Number,
		require: true,
	},
	customer_id: {
		type: mongoose.Types.ObjectId,
	},
	rating: {
		type: Number,
	},
	comment: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

app.post("/sendreview", fetchUser, async (req, res) => {
	const review = new Review({
		product_id: req.body.product_id,
		rating: req.body.rating,
		customer_id: req.user.id,
		comment: req.body.comment,
	});
	await review.save();

	res.json({ message: "Đánh giá đã được thêm", review });
});

app.post("/getreview/:id", async (req, res) => {
	try {
		const product_id = req.params.id;
		const review = await Review.find({ product_id: product_id });

		if (!review) {
			return res.status(404).send({ message: "review not found" });
		}
		res.send(review);
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Error fetching review" });
	}
});


app.post("/getallreview", async (req, res) => {
	let reviewData = await Review.find({});
	res.json(reviewData);
});

app.post('/sendemail', (req, res) => {
    console.log("Received request body:", req.body);

    if (!req.body.email || !req.body.code) {
        return res.status(400).json({ error: "Missing email or code" });
    }

    const mailOptions = {
        from: 'fashiontpv@gmail.com',
        to: req.body.email,
        subject: 'Welcome to Fashion TPV',
        text: `Mã xác nhận: ${req.body.code}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ error: "Failed to send email", details: error.toString() });
        } else {
            console.log("Email sent:", info.response);
            res.status(200).json({ message: "Email sent successfully", info: info.response });
        }
    });
});
app.post("/updatepassword", async (req, res) => {
	await Users.findOneAndUpdate(
		{ email: req.body.email },
		{ password: req.body.password }
	);
	res.json({ message: "Update order successful" });
});

app.listen(port, (error) => {
	if (!error) {
		console.log("Server running on port " + port);
	} else {
		console.log("Error" + error);
	}
});
