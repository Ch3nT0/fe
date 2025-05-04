import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";






export default function HomeAd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {

    setLoading(false);
  }, [navigate]);



  return (
    <>

      {/* Nội dung chính */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
          <Typography>Loading ...</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            marginLeft: isSidebarOpen ? "260px" : "90px",
            transition: "margin-left 0.3s",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "20px",
            marginTop: "100px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/admin/products")}
          >
            Quản lý phòng
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate("/admin/order")}
          >
            Quản lý đơn đặt lịch
          </Button>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={() => navigate("/admin/accounts")}
          >
            Quản lý tài khoản
          </Button>
        </Box>
      )}
    </>
  );
}
