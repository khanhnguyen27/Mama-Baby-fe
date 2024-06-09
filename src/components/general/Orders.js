import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react'

export default function Orders() {
    const accessToken = localStorage.getItem("accessToken");
    const decodedAccessToken = jwtDecode(accessToken);
    const userId = decodedAccessToken.UserID;
    console.log(userId);
    const [order, setOrder] = useState([]);
  return (
    <div>Orders</div>
  )
}
