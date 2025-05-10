import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Snackbar,
    Alert,
    Typography,
    Paper,
} from "@mui/material";

export default function DeleteHotel() {
    const { idHotel } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [error, setError] = useState("");
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await fetch(`http://localhost:8080/hotel?idHotel=${idHotel}`);
                const data = await response.json();

                if (!response.ok) throw new Error(data.error || "Không thể tải dữ liệu khách sạn.");
                if (Array.isArray(data) && data.length > 0) {
                    setHotel(data[idHotel - 1]);
                } else {
                    throw new Error("Không tìm thấy khách sạn.");
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchHotel();
    }, [idHotel]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/delete-hotel/${idHotel}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Xoá khách sạn thất bại.");

            setSnackBarOpen(true);
            setTimeout(() => navigate("/hotel"), 1000);
        } catch (err) {
            setError(err.message);
        }
    };

    if (!hotel) return null;

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
            <Paper sx={{ padding: 4, width: "50%" }}>
                <Typography variant="h5" gutterBottom>
                    Bạn có chắc muốn xoá khách sạn này?
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Tên:</strong> {hotel.hotelName}
                </Typography>
                <Typography variant="body2" gutterBottom>
                    <strong>Địa chỉ:</strong> {hotel.hotelAddress}
                </Typography>
                {hotel.img && (
                    <Box mt={2} textAlign="center">
                        <img
                            src={hotel.img}
                            alt="Ảnh khách sạn"
                            style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                        />
                    </Box>
                )}

                <Box mt={3}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        sx={{ mr: 2 }}
                    >
                        Xoá khách sạn
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/hotel")}
                    >
                        Hủy
                    </Button>
                </Box>
            </Paper>

            <Snackbar
                open={snackBarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackBarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity="success">Khách sạn đã được xoá thành công!</Alert>
            </Snackbar>

            {error && (
                <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}>
                    <Alert severity="error">{error}</Alert>
                </Snackbar>
            )}
        </Box>
    );
}
