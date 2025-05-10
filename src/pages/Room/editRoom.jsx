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

export default function EditRoom() {
    const { idRoom } = useParams();
    const { idHotel } = useParams();
    console.log(idRoom);
    const navigate = useNavigate();

    const [room, setRoom] = useState({
        roomName: "",
        price: "",
        capacity: "",
        roomType: "",
        status: "",
        hotelID: idHotel,
    });

    const [error, setError] = useState("");
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await fetch(`http://localhost:8080/room/${idRoom}`);
                const data = await response.json();
                console.log(data);

                if (!response.ok) throw new Error(data.error || "Không thể lấy dữ liệu phòng.");

                setRoom(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchRoom();
    }, [idRoom]);

    const handleChange = (e) => {
        setRoom({ ...room, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/edit-room/${idRoom}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(room),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Cập nhật phòng thất bại!");

            setSnackBarOpen(true);
            setTimeout(() => navigate(`/hotel`), 1000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
            <Paper sx={{ padding: 4, width: "50%" }}>
                <Typography variant="h4" gutterBottom>Sửa Phòng</Typography>
                <form onSubmit={handleUpdate}>
                    <TextField
                        fullWidth margin="normal" label="Số phòng"
                        name="roomName" value={room.roomName}
                        onChange={handleChange} required
                    />
                    <TextField
                        fullWidth margin="normal" label="Giá mỗi đêm"
                        name="price" type="number"
                        value={room.price}
                        onChange={handleChange} required
                    />
                    <TextField
                        fullWidth margin="normal" label="Sức chứa"
                        name="capacity" type="number"
                        value={room.capacity}
                        onChange={handleChange} required
                    />
                    <TextField
                        fullWidth margin="normal" label="Loại phòng"
                        name="roomType" select
                        value={room.roomType}
                        onChange={handleChange} required
                    >
                        <MenuItem value="Deluxe">Deluxe</MenuItem>
                        <MenuItem value="Standard">Standard</MenuItem>
                        <MenuItem value="Suite">Suite</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth margin="normal" label="Trạng thái"
                        name="status" select
                        value={room.status}
                        onChange={handleChange} required
                    >
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="maintenance">Maintenance</MenuItem>
                    </TextField>

                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button type="submit" variant="contained" color="primary">
                            Lưu Thay Đổi
                        </Button>
                    </Box>
                </form>
            </Paper>

            <Snackbar
                open={snackBarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackBarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity="success">Thành công!</Alert>
            </Snackbar>

            {error && (
                <Snackbar
                    open={!!error}
                    autoHideDuration={3000}
                    onClose={() => setError("")}
                >
                    <Alert severity="error">{error}</Alert>
                </Snackbar>
            )}
        </Box>
    );
}
