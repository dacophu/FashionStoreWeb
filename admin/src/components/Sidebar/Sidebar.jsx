import React from 'react'
import './Sidebar.css'
import {Link} from 'react-router-dom'
import add from '../../assets/add.png'
import list from '../../assets/list.png'
import order from '../../assets/order.png'
import report from '../../assets/report.png'
export default function Sidebar() {
  return (
    <div className='sidebar'>
        <Link to={'/addproduct'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={add}alt="" />
            <p>Thêm sản phẩm 
            </p>
            
        </div>
        </Link>
        <Link to={'/listproduct'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={list}alt="" />
            <p>Danh sách sản phẩm</p>
        </div>
        </Link>
        <Link to={'/order'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={order}alt="" />
            <p>Quản lý đơn hàng</p>
        </div>
        </Link>
        <Link to={'/report'} style={{textDecoration:"none"}}>
        <div className="sidebar-item">
            <img src={report}alt="" />
            <p>Báo cáo thống kê</p>
        </div>
        </Link>
    </div>
  )
}
