import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import CourseInfo from "./CourseInfo";
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

const CourseEdit = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [courseTypes, setCourseTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Vui lòng đăng nhập!");

        // Lấy thông tin khóa học
        const courseResponse = await axios.get(
          `${apiUrl}/lms/course/${id}/details`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (courseResponse.data && courseResponse.data.result) {
          const courseData = courseResponse.data.result;
          setCourse(courseData);
          console.log("Course data from API:", courseData);
        } else {
          throw new Error("Dữ liệu khóa học không hợp lệ");
        }

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
    fetchData();
  }, [id]);

  if (loading) return <CircularProgress sx={{ color: "#ffffff", m: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!course) return <Typography>Không tìm thấy khóa học</Typography>;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Chỉnh sửa khóa học
        </Typography>
        <ErrorBoundary>
          <CourseInfo
            course={course}
            setCourse={setCourse}
            courseTypes={courseTypes}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <SectionManager
            courseId={id}
            sections={course.sections || []}
            setCourse={setCourse}
          />
        </ErrorBoundary>
      </Container>
    </ThemeProvider>
  );
};

export default CourseEdit;