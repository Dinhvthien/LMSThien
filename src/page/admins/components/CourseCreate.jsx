import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import CourseInfoCreate from "./CourseInfoCreate";
import SectionManager from "./SectionManager";

// Theme đen trắng
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#ffffff", secondary: "#b0b0b0" },
    primary: { main: "#ffffff" },
    secondary: { main: "#b0b0b0" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Typography color="error">Đã xảy ra lỗi trong component</Typography>;
    }
    return this.props.children;
  }
}

const CourseCreate = () => {
  const [course, setCourse] = useState(null);
  const [courseTypes, setCourseTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openModal, setOpenModal] = useState(false);
  const [newCourseTypeName, setNewCourseTypeName] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCourseTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Vui lòng đăng nhập!");

        const courseTypesResponse = await axios.get(
          `${apiUrl}/lms/course-types`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Response từ GET /lms/course-types:", courseTypesResponse.data);
        let types = [];
        if (Array.isArray(courseTypesResponse.data)) {
          types = courseTypesResponse.data;
        } else if (courseTypesResponse.data?.result && Array.isArray(courseTypesResponse.data.result.content)) {
          types = courseTypesResponse.data.result.content;
        }
        console.log("Parsed courseTypes:", types);
        if (types.length === 0) {
          console.warn("Không có loại khóa học nào được trả về từ API");
        }
        setCourseTypes(types);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err.response?.data || err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseTypes();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
    setNewCourseTypeName("");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewCourseTypeName("");
  };

  const handleCreateCourseType = async () => {
    if (!newCourseTypeName.trim()) {
      setSnackbar({ open: true, message: 'Vui lòng nhập tên loại khóa học!', severity: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập!");

      const response = await axios.post(
        `${apiUrl}/lms/course-types`,
        { name: newCourseTypeName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCourseTypes([...courseTypes, response.data]);
      setSnackbar({ open: true, message: 'Tạo loại khóa học thành công!', severity: 'success' });
      handleCloseModal();
    } catch (err) {
      console.error("Lỗi khi tạo loại khóa học:", err.response?.data || err.message);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Lỗi khi tạo loại khóa học', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return <CircularProgress sx={{ color: "#ffffff", m: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tạo khóa học mới
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{ mr: 2 }}
          >
            Tạo loại mới
          </Button>
        </Box>
        <ErrorBoundary>
          <CourseInfoCreate
            course={course || { title: "", description: "", thumbnailUrl: "", price: 0, status: "HIDDEN", courseTypeId: "" }}
            setCourse={setCourse}
            courseTypes={courseTypes}
            onCreateCourseType={handleOpenModal}
          />
        </ErrorBoundary>
        {course && (
          <ErrorBoundary>
            <SectionManager
              courseId={course.id}
              sections={course.sections || []}
              setCourse={setCourse}
            />
          </ErrorBoundary>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Tạo loại khóa học mới</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Tên loại khóa học"
              fullWidth
              value={newCourseTypeName}
              onChange={(e) => setNewCourseTypeName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Hủy</Button>
            <Button onClick={handleCreateCourseType} variant="contained" color="primary">
              Tạo
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default CourseCreate;