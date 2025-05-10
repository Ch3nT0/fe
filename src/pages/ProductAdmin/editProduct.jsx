import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Typography,
  Paper,
} from "@mui/material";

export default function EditHotel() {
  const { idHotel } = useParams();// Lấy id khách sạn từ URL
  const navigate = useNavigate();

  const [hotel, setHotel] = useState({
    hotelName: "",
    hotelAddress: "",
    description: "",
    img: "",
  });

  const [error, setError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const encodedQueryString = new URLSearchParams({ idHotel }).toString();
        console.log(encodedQueryString);
        const response = await fetch(`http://localhost:8080/hotel?${encodedQueryString}`);
        const data = await response.json();
        const tmp = data.find(hotel => hotel.id === parseInt(idHotel));
        if (!response.ok) throw new Error(data.error || "Không thể lấy dữ liệu khách sạn.");

        if (Array.isArray(data) && data.length > 0) {
          setHotel(tmp);
        } else {
          throw new Error("Không tìm thấy khách sạn.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchHotel();
  }, [idHotel]);

  const handleChange = (e) => {
    setHotel({ ...hotel, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/edit-hotel/${idHotel}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hotel),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Không thể cập nhật khách sạn!");

      setSnackBarOpen(true);
      setTimeout(() => navigate("/hotel"), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Paper sx={{ padding: 4, width: "50%" }}>
        <Typography variant="h4" gutterBottom>Chỉnh sửa thông tin khách sạn</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Tên khách sạn"
            name="hotelName"
            value={hotel.hotelName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Địa chỉ khách sạn"
            name="hotelAddress"
            value={hotel.hotelAddress}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Mô tả"
            name="description"
            multiline
            rows={4}
            value={hotel.description}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Link ảnh"
            name="img"
            value={hotel.img}
            onChange={handleChange}
            required
          />
          {hotel.img && (
            <Box mt={2} textAlign="center">
              <img
                src={hotel.img}
                alt="Preview ảnh khách sạn"
                style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
              />
            </Box>
          )}
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Cập nhật thông tin
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackBarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">Thông tin đã được cập nhật thành công!</Alert>
      </Snackbar>

      {error && (
        <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}
