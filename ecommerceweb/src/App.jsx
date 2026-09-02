import React,{useEffect} from 'react'
import Layout from './components/Layout'
import { useLocation } from "react-router-dom";

export default function App() {
  const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
  return (
    <div><Layout/></div>
  )
}
