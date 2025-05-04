import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setIsAdmin, setIsLoggedIn } from "../../Store/authSlice";
export default function Login() {
  const navigate = useNavigate();

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  const handleClick = async () => {
    try {
      window.location.href = "http://localhost:8080/oauth2/authorization/google";
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      setSnackBarMessage(error.message);
      setSnackBarOpen(true);
    }

  };

  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message);

        dispatch(setUser(data.user));
        dispatch(setIsLoggedIn(true)); 

        if (data.isAdmin) {
          dispatch(setIsAdmin(true));
          navigate("/home");
        } else {
          dispatch(setIsAdmin(false));
          navigate("/home");
        }
        // Nếu cần lưu token:
        if (data.userId) {
          localStorage.setItem("userId", data.userId);
        }
      })
      .catch((err) => {
        // Hiển thị lỗi ở đây nếu muốn
        console.error("Đăng nhập thất bại:", err.message);
      });
  };


  return (
    <>
      <Snackbar
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        bgcolor={"#f0f2f5"}
      >
        <Card
          sx={{
            minWidth: 400,
            maxWidth: 500,
            boxShadow: 4,
            borderRadius: 4,
            padding: 4,
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom>
              Đăng nhập
            </Typography>
            <Box
              component="form"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              width="100%"
              onSubmit={handleSubmit}
            >
              <TextField
                label="Tài khoản"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Mật khẩu"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                // onClick={handleSubmit}
                fullWidth
                sx={{
                  mt: "15px",
                  mb: "25px",
                }}
              >
                Đăng nhập
              </Button>
              <Divider></Divider>
            </Box>

            <Box display="flex" flexDirection="column" width="100%" gap="25px">
              <Button
                type="button"
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleClick}
                fullWidth
                sx={{ gap: "10px" }}
              >
                <GoogleIcon />
                Đăng nhập bằng Google
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                onClick={() => (window.location.href = "http://localhost:3000/register")}
              >
                Tạo tài khoản
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
