import { Box, Container, Typography, Button } from "@mui/material";
import './style.css'

import banner1 from "../../assets/img/banner1.jpg";
import banner2 from "../../assets/img/banner2.jpg";
import category1 from "../../assets/img/khachsancaocap.jpg";
import category2 from "../../assets/img/resortbien.jpg";
import category3 from "../../assets/img/homestayvacanho.jpg";

export default function HomeClient() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#f8f9fa",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        {/* Start Banner Hero */}
        <div
          id="template-mo-zay-hero-carousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <ol className="carousel-indicators">
            <li
              data-bs-target="#template-mo-zay-hero-carousel"
              data-bs-slide-to="0"
              className="active"
            ></li>
            <li
              data-bs-target="#template-mo-zay-hero-carousel"
              data-bs-slide-to="1"
            ></li>
          </ol>
          <div className="carousel-inner">
            {/* Banner 1 */}
            <div
              className="carousel-item active"
              style={{
                backgroundImage: `url(${banner1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="container-fluid px-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="row p-5 align-items-center text-white">
                  <div className="col-md-6 tmpPadding">
                    <h1 className="h1 text-success">
                      <b>Khám Phá Kỳ Nghỉ Thượng Hạng</b>
                    </h1>
                    <h3 className="h2">
                      Dịch vụ đẳng cấp – Trải nghiệm sang trọng – Giá cả hợp lý
                    </h3>
                    <p>
                      Tận hưởng không gian nghỉ dưỡng tinh tế với tiện nghi cao cấp, mang đến sự thoải mái và thư giãn tuyệt đối cho mỗi chuyến đi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner 2 */}
            <div
              className="carousel-item"
              style={{
                backgroundImage: `url(${banner2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="container-fluid px-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="row p-5 align-items-center text-white">
                  <div className="col-md-6 tmpPadding">
                    <h1 className="h1 text-success">
                      <b>Phòng Ở Đầy Đủ Tiện Nghi</b>
                    </h1>
                    <h3 className="h2">Tự Tin Khám Phá Với Chỗ Nghỉ Hoàn Hảo</h3>
                    <p>
                      Phòng ốc hiện đại, dịch vụ tận tâm, vị trí thuận lợi – Mọi yếu tố đều sẵn sàng để chuyến đi của bạn thêm trọn vẹn và đáng nhớ!
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <a
            className="carousel-control-prev text-decoration-none w-auto ps-3"
            href="#template-mo-zay-hero-carousel"
            role="button"
            data-bs-slide="prev"
          >
            <i className="fas fa-chevron-left"></i>
          </a>
          <a
            className="carousel-control-next text-decoration-none w-auto pe-3"
            href="#template-mo-zay-hero-carousel"
            role="button"
            data-bs-slide="next"
          >
            <i className="fas fa-chevron-right"></i>
          </a>
        </div>
        {/* End Banner Hero */}

        {/* Start Categories of The Month */}
        <Container sx={{ py: 5 }}>
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold">
              Khách Sạn Đa Dạng
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <p className="tmpNoiDung">
                Đặt phòng dễ dàng với hàng loạt khách sạn thuộc nhiều phân khúc khác nhau,
                giúp bạn tìm được chỗ nghỉ lý tưởng cho mọi chuyến đi chỉ trong một nơi.
              </p>
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            {[
              { img: category1, title: "Khách sạn cao cấp" },
              { img: category2, title: "Resort biển" },
              { img: category3, title: "Homestay & căn hộ" },
            ].map((category, index) => (
              <Box key={index} sx={{ p: 2, textAlign: "center" }}>
                <img
                  src={category.img}
                  alt={category.title}
                  style={{
                    width: "350px",
                    height: "350px",
                    borderRadius: "50%",
                    marginTop: "50px",
                    border: "3px solid #ddd",
                  }}
                />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {category.title}
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 1 }}
                  onClick={() => window.location.href = "http://localhost:3000/hotel"}
                >
                  Đặt ngay
                </Button>
              </Box>
            ))}
          </Box>

        </Container>
        {/* End Categories of The Month */}
      </Box>
    </>
  );
}
