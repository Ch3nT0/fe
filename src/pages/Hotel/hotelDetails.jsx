/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
    Row, Col, Card, Select, Button, Typography, message,
} from "antd";
import { Link, useParams } from "react-router-dom";
import { DatePicker } from 'antd';

import dayjs from 'dayjs';
import { useSelector } from "react-redux";
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

export default function HotelDetails() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ date: { checkIn: "", checkOut: "" }, capacity: "", type: "" });
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const { hotelid } = useParams();
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
            console.log(`http://localhost:8080/hotel/${hotelid}?${encodedQueryString}`);
            const response = await fetch(`http://localhost:8080/hotel/${hotelid}?${encodedQueryString}`);
            if (!response.ok) throw new Error("Không thể tải danh sách phòng khách sạn!");

            const data = await response.json();
            console.log(data);
            setRooms(data || []);
        } catch (err) {
            console.error("Lỗi API:", err);
            message.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const params = {
            checkIn: filters.date.checkIn ? dayjs(filters.date.checkIn).format("YYYY-MM-DD") : "",
            checkOut: filters.date.checkOut ? dayjs(filters.date.checkOut).format("YYYY-MM-DD") : "",
            capacity: filters.capacity || "",
            type: filters.type || "",
        };
        fetchHotels(params);
    };

    const handleDeleteRoom = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa phòng này không?")) return;

        try {
            const response = await fetch(`http://localhost:8080/delete-room/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Không thể xóa phòng!");

            alert(data.message);

        } catch (err) {
            alert("Lỗi: " + err.message);
        }
        fetchHotels(hotelid);
    };


    return (
        <Row gutter={16} style={{ marginTop: 50 }}>
            {/* Bộ lọc */}
            <Col span={6}>
                {/* <RangePicker
                    style={{ width: "100%", marginBottom: 10 }}
                    onChange={(dates) => {
                        if (dates) {
                            setFilters({
                                ...filters,
                                date: {
                                    checkIn: dates[0],
                                    checkOut: dates[1],
                                },
                            });
                        } else {
                            setFilters({
                                ...filters,
                                date: {
                                    checkIn: null,
                                    checkOut: null,
                                },
                            });
                        }
                    }}
                    value={
                        filters.date.checkIn && filters.date.checkOut
                            ? [dayjs(filters.date.checkIn), dayjs(filters.date.checkOut)]
                            : []
                    }
                    placeholder={['Ngày đến', 'Ngày đi']}
                /> */}

                <Select
                    placeholder="Số người /phòng"
                    value={filters.capacity || undefined}
                    onChange={(value) => setFilters({ ...filters, capacity: value || "" })}
                    style={{ width: "100%", marginBottom: 10 }}
                >
                    <Option value="">Tất cả</Option>
                    <Option value="1">Đơn (1)</Option>
                    <Option value="2">Đôi (2)</Option>
                    <Option value="3">Gia đình (3)</Option>
                </Select>

                <Select
                    placeholder="Chọn loại phòng"
                    value={filters.type || undefined}
                    onChange={(value) => setFilters({ ...filters, type: value || "" })}
                    style={{ width: "100%", marginBottom: 10 }}
                >
                    <Option value="">Tất cả</Option>
                    <Option value="Deluxe">Deluxe</Option>
                    <Option value="Standard">Standard</Option>
                    <Option value="Suite">Suite</Option>
                </Select>
                <Button type="primary" block onClick={handleSearch}>Tìm kiếm</Button>

            </Col>

            {/* Danh sách khách sạn */}
            <Col span={18}>
                <Title level={2} style={{ textAlign: "center" }}>Danh sách khách sạn</Title>
                {isAdmin && (
                    <li style={{ marginBottom: 15 }}>
                        <Link className="btn btn-primary" to="add-room">Thêm phòng +</Link>
                    </li>
                )}
                <Row gutter={[16, 16]} justify="center">
                    {rooms.length > 0 && rooms.map(rooms => (
                        <Col key={rooms.roomID} xs={24} sm={12} md={8}>
                            <Card
                                cover={
                                    <img
                                        alt={rooms.roomName}
                                        src="https://images.trvl-media.com/lodging/20000000/19440000/19430600/19430592/8077f82a.jpg?impolicy=fcrop&w=1200&h=800&p=1&q=medium"
                                        style={{ height: 250, objectFit: "cover" }}
                                    />
                                }
                                actions={[
                                    <Link to={`/room/${rooms.roomID}`}>Đặt phòng</Link>,
                                    isAdmin && <Link to={`/edit-room/${rooms.roomID}`}>Sửa</Link>,
                                    isAdmin && <Button type="link" danger onClick={() => handleDeleteRoom(rooms.roomID)}> Xóa</Button>,
                                ]}
                            >
                                <Card.Meta
                                    title={"Room: " + rooms.roomName}
                                    description={
                                        <>
                                            <p>Price: {rooms.price}</p>
                                            <p>Type: {rooms.roomType}</p>
                                            <p>Capacity: {rooms.capacity}</p>
                                        </>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Col >
        </Row >
    );
}
