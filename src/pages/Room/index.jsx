import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../services/localStorageService";
import { DatePicker } from 'antd';
import './style.css'
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [filters, setFilters] = useState({ location: "" });
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/room/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        console.log(data)
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    const token = getToken();
    if (!token) {
      alert("Vui lòng đăng nhập trước khi mua!");
      navigate("/login");
      return;
    }


    const totalMoney = product.price * quantity;
    navigate("/payments", {
      state: {
        quantity,
        totalMoney,
        id: Number(id),
      },
    });
  };

  const handleAddToCart = async () => {
    if (product.category !== "accessory") {
      alert("Vui lòng chọn size trước khi thêm vào giỏ hàng!");
      return;
    }
    const totalMoney = product.price * quantity;
    const cartData = {
      productId: product.id,
      numberOfProducts: quantity,
      totalMoney: totalMoney,
    };
    const token = getToken();
    try {
      const response = await fetch("http://localhost:8080/cart-detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartData),
      });

      if (!response.ok) throw new Error("Không thể thêm vào giỏ hàng");
      alert("Thêm vào giỏ hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Đã xảy ra lỗi khi thêm vào giỏ hàng!");
    }
  };

  if (!product) return <p>Loading...</p>;
  console.log(filters.checkIn);
  return (
    <>
      <section className="bg-light">
        <div className="container pb-5">
          <div className="row">
            <div className="col-lg-5 mt-5">
              <div className="card mb-3">
                <img className="card-img img-fluid" src="https://images.trvl-media.com/lodging/20000000/19440000/19430600/19430592/8077f82a.jpg?impolicy=fcrop&w=1200&h=800&p=1&q=medium" alt={product.roomName} />
              </div>
            </div>

            <div className="col-lg-7 mt-5">
              <div className="card">
                <div className="card-body">
                  <h1 className="h2">{product.roomName}</h1>
                  <p className="h3 py-2">{product.price} ₫/ Đêm</p>
                  <RangePicker showTime
                    style={{ width: "100%", marginBottom: 10 }}
                    onChange={(dates) => {
                      if (dates) {
                        setFilters({ ...filters, checkIn: dates[0], checkOut: dates[1] });
                      } else {
                        setFilters({ ...filters, checkIn: null, checkOut: null });
                      }
                    }}
                    value={
                      filters.checkIn && filters.checkOut
                        ? [dayjs(filters.checkIn), dayjs(filters.checkOut)]
                        : []
                    }
                    placeholder={['Ngày đến', 'Ngày đi']}
                  />
                  <div className="d-flex align-items-center">
                    <button className="btn btn-success" onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}>-</button>
                    <span className="mx-3">{quantity}</span>
                    <button className="btn btn-success" onClick={() => setQuantity((prev) => prev + 1)}>+</button>
                  </div>

                  <div className="row pb-3 mt-3">
                    <div className="col d-grid">
                      <button className="btn btn-danger btn-lg" onClick={handleBuyNow}>Mua ngay</button>
                    </div>
                    <div className="col d-grid">
                      <button className="btn btn-success btn-lg" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RoomDetails;