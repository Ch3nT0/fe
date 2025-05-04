import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";

export default function AddRoom() {
  const { idHotel } = useParams(); // Lấy idHotel từ URL
  const navigate = useNavigate();

  const [room, setRoom] = useState({
    roomNumber: "",
    pricePerNight: "",
    capacity: "",
    roomType: "",
    status: "",
    hotelID: idHotel, // Khởi tạo hotelID từ URL
  });

  const [error, setError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleChange = (e) => {
    setRoom({ ...room, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(room)
    try {
      const response = await fetch("http://localhost:8080/addRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Không thể thêm phòng!");

      setSnackBarOpen(true);
      setTimeout(() => navigate(`/hotel/${idHotel}`), 1000); // Chuyển hướng sau khi thêm thành công
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Paper sx={{ padding: 4, width: "50%" }}>
        <Typography variant="h4" gutterBottom>Thêm Phòng Mới</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Số phòng"
            name="roomNumber"
            value={room.roomNumber}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Giá mỗi đêm"
            name="pricePerNight"
            type="number"
            value={room.pricePerNight}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Sức chứa"
            name="capacity"
            type="number"
            value={room.capacity}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Loại phòng"
            name="roomType"
            select
            value={room.roomType}
            onChange={handleChange}
            required
          >
            <MenuItem value="Deluxe">Deluxe</MenuItem>
            <MenuItem value="Standard">Standard</MenuItem>
            <MenuItem value="Suite">Suite</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Trạng thái"
            name="status"
            select
            value={room.status}
            onChange={handleChange}
            required
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Thêm Phòng
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackBarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">Phòng đã được thêm thành công!</Alert>
      </Snackbar>

      {error && (
        <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}
