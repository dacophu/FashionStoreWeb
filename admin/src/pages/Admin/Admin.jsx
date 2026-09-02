import React from "react";
import "./Admin.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Routes,Route, Router } from "react-router-dom";
import AddProduct from "../../components/AddProduct/AddProduct";
import ListProduct from "../../components/ListProduct/ListProduct";
import Order from "../../components/Order/Order";
import Report from "../../components/Report/Report";
export default function Admin() {
	return (
		<div className="admin">
			<Sidebar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct/>}/>
        <Route path="/listproduct" element={<ListProduct/>}/>
        <Route path="/order" element={<Order/>}/>
        <Route path="/report" element={<Report/>}/>
      </Routes>
		</div>
	);
}
