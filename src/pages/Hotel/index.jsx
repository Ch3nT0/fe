import { useEffect, useState } from "react";
import {
  Row, Col, Card, Select, Button, Typography, message,
} from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const { Option } = Select;
const { Title } = Typography;

export default function ShopAntd() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: "" });
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  useEffect(() => {
    fetchHotels({ page: 0 });
  }, []);

  const fetchHotels = async (params) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(
        Object.entries(params).filter(([_, v]) => v)
      ).toString();
      const encodedQueryString = queryString.replace(/\+/g, '%20');
      const response = await fetch(`http://localhost:8080/hotel?${encodedQueryString}`);
      if (!response.ok) throw new Error("Không thể tải danh sách khách sạn!");

      const data = await response.json();
      setHotels(data || []);
    } catch (err) {
      console.error("Lỗi API:", err);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = { location: filters.location || "" };
    fetchHotels(params);
  };

  const handleDeleteHotel = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khách sạn này không?")) return;

    try {
      const response = await fetch(`http://localhost:8080/delete-hotel/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Không thể xóa khách sạn!");

      alert(data.message); // hoặc show snackbar nếu bạn dùng MUI
      fetchHotels(filters); // gọi lại hàm lấy danh sách khách sạn

    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  return (
    <Row gutter={16} style={{ marginTop: 50 }}>
      {/* Bộ lọc */}
      <Col span={6}>
        <Select
          placeholder="Địa điểm"
          value={filters.location}
          onChange={(value) => setFilters({ ...filters, location: value })}
          style={{ width: "100%", marginBottom: 10 }}
        >
          {["", "Ha Noi", "Da Nang", "Ho Chi Minh City", "Nha Trang", "Da Lat"].map(loc => (
            <Option key={loc} value={loc}>
              {loc ? loc.replace(/_/g, " ") : "Tất cả"}
            </Option>
          ))}
        </Select>

        <Button type="primary" block onClick={handleSearch}>Tìm kiếm</Button>
      </Col>

      {/* Danh sách khách sạn */}
      <Col span={18}>
        <Title level={2} style={{ textAlign: "center" }}>Danh sách khách sạn</Title>
        {isAdmin && (
          <li style={{ marginBottom: 15 }}>
            <Link className="btn btn-primary" to="add-hotel">Thêm khách sạn +</Link>
          </li>
        )}
        <Row gutter={[16, 16]} justify="center">
          {hotels.map(hotel => (
            <Col key={hotel.id} xs={24} sm={12} md={8}>
              <Card
                cover={
                  <img
                    alt={hotel.hotelName}
                    src={hotel.img}
                    style={{ height: 250, objectFit: "cover" }}
                  />
                }
                actions={[
                  <Link to={`/hotel/${hotel.id}`}>Xem chi tiết</Link>,
                  isAdmin && <Link to={`/edit-hotel/${hotel.id}`}>Sửa</Link>,
                  isAdmin && <Button type="link" danger onClick={() => handleDeleteHotel(hotel.id)}>Xóa</Button>,
                ]}

              >
                <Card.Meta
                  title={hotel.hotelName}
                  description={
                    <>
                      <p><strong>Địa chỉ:</strong> {hotel.hotelAddress}</p>
                      <p>{hotel.description}</p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}
