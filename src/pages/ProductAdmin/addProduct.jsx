import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Typography,
  Paper,
} from "@mui/material";

export default function AddHotelRoom() {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState({
    hotelName: "",
    hotelAddress: "",
    description: "",
    img: "",
  });

  const [error, setError] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleChange = (e) => {
    setHotel({ ...hotel, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(hotel);

    try {
      const response = await fetch("http://localhost:8080/add-hotel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hotel),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Không thể thêm phòng khách sạn!");

      setSnackBarOpen(true);
      setTimeout(() => navigate("/hotel"), 1000);
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Paper sx={{ padding: 4, width: "50%" }}>
        <Typography variant="h4" gutterBottom>Thêm Phòng Khách Sạn</Typography>
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
            Thêm Phòng Khách Sạn
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackBarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">Phòng khách sạn đã được thêm thành công!</Alert>
      </Snackbar>

      {error && (
        <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}
