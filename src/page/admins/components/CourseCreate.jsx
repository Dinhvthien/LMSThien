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
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchCourseTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Vui lòng đăng nhập!");

        // Lấy danh sách loại khóa học
        const courseTypesResponse = await axios.get(
          `${apiUrl}/lms/course-types`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Response từ GET /lms/course-types:", courseTypesResponse.data);
        let types = [];
        if (Array.isArray(courseTypesResponse.data)) {
          types = courseTypesResponse.data;
        } else if (
          courseTypesResponse.data?.result &&
          Array.isArray(courseTypesResponse.data.result.content)
        ) {
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

  if (loading) return <CircularProgress sx={{ color: "#ffffff", m: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tạo khóa học mới
        </Typography>
        <ErrorBoundary>
          <CourseInfoCreate
            course={course || { title: "", description: "", thumbnailUrl: "", price: 0, status: "HIDDEN", courseTypeId: "" }}
            setCourse={setCourse}
            courseTypes={courseTypes}
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
      </Container>
    </ThemeProvider>
  );
};

export default CourseCreate;