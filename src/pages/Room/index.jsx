import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DatePicker } from 'antd';
import dayjs from "dayjs";
import './style.css';

const { RangePicker } = DatePicker;

const RoomDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [filters, setFilters] = useState({ location: "" });
  const [disabledRanges, setDisabledRanges] = useState([]);

  // Lấy thông tin phòng
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/room/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (id) {
      fetchProduct();
      fetchDisabledDates();
    }
  }, [id]);

  // ✅ Tách ra ngoài để gọi lại sau khi đặt phòng
  const fetchDisabledDates = async () => {
    try {
      const res = await fetch(`http://localhost:8080/booking/room/${id}`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();

      const ranges = data.bookings.map(b => ({
        start: dayjs(b.check_in),
        end: dayjs(b.check_out),
      }));
      setDisabledRanges(ranges);
    } catch (err) {
      console.error(err);
    }
  };

  // Kiểm tra ngày bị disabled
  const isDateDisabled = (current) => {
    return disabledRanges.some(({ start, end }) =>
      current.isSame(start, 'day') ||
      current.isSame(end, 'day') ||
      (current.isAfter(start, 'day') && current.isBefore(end, 'day'))
    );
  };

  // ✅ Đặt phòng + tự cập nhật ngày đã bị đặt
  const handleBook = async () => {
    const userID = localStorage.getItem("userId");
    console.log(filters);
    if (!userID) {
      alert("Bạn cần đăng nhập để đặt phòng.");
      return;
    }

    if (!filters.checkIn || !filters.checkOut) {
      alert("Vui lòng chọn ngày đến và ngày đi.");
      return;
    }

    const payload = {
      userID: parseInt(userID),
      roomID: parseInt(id),
      checkIn: filters.checkIn.format("YYYY-MM-DD"),
      checkOut: filters.checkOut.format("YYYY-MM-DD")
    };

    console.log(payload);
    try {
      const response = await fetch("http://localhost:8080/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Đặt phòng thất bại");
      }

      alert("Đặt phòng thành công!");
      fetchDisabledDates(); // 🔁 Tự động cập nhật ngày đã đặt
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi đặt phòng: " + err.message);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <section className="bg-light">
        <div className="container pb-5">
          <div className="row">
            <div className="col-lg-5 mt-5">
              <div className="card mb-3">
                <img
                  className="card-img img-fluid"
                  src="https://images.trvl-media.com/lodging/20000000/19440000/19430600/19430592/8077f82a.jpg?impolicy=fcrop&w=1200&h=800&p=1&q=medium"
                  alt={product.roomName}
                />
              </div>
            </div>

            <div className="col-lg-7 mt-5">
              <div className="card">
                <div className="card-body">
                  <h1 className="h2">{product.roomName}</h1>
                  <p className="h3 py-2">{product.price} ₫/ Đêm</p>

                  <RangePicker
                    style={{ width: "100%", marginBottom: 10 }}
                    onChange={(dates) => {
                      if (dates) {
                        setFilters({
                          ...filters,
                          checkIn: dates[0],
                          checkOut: dates[1]
                        });
                      } else {
                        setFilters({ ...filters, checkIn: null, checkOut: null });
                      }
                    }}
                    value={
                      filters.checkIn && filters.checkOut
                        ? [dayjs(filters.checkIn), dayjs(filters.checkOut)]
                        : []
                    }
                    disabledDate={isDateDisabled}
                    placeholder={['Ngày đến', 'Ngày đi']}
                  />

                  <div className="row pb-3 mt-3">
                    <div className="col d-grid">
                      <button className="btn btn-success btn-lg" onClick={handleBook}>Đặt phòng</button>
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
