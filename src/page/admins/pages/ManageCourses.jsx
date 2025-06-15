import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  ThemeProvider,
  createTheme,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

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

// Pagination Component (Adapted for MUI)
const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  if (totalPages <= 0) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 4 }}>
      <Button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        variant="contained"
        sx={{
          bgcolor: "#2a2a2a",
          color: "#ffffff",
          "&:hover": { bgcolor: "#3a3a3a" },
          "&:disabled": { bgcolor: "#1e1e1e", color: "#b0b0b0" },
          borderRadius: "9999px",
          px: 3,
          py: 1,
        }}
      >
        Trang trước
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          onClick={() => setCurrentPage(page)}
          variant={page === currentPage ? "contained" : "outlined"}
          sx={{
            bgcolor: page === currentPage ? "#1976d2" : "#2a2a2a",
            color: "#ffffff",
            borderColor: page === currentPage ? "#1976d2" : "#ffffff",
            "&:hover": {
              bgcolor: page === currentPage ? "#1565c0" : "#3a3a3a",
              borderColor: "#ffffff",
            },
            borderRadius: "9999px",
            minWidth: "40px",
            px: 2,
            py: 1,
          }}
        >
          {page}
        </Button>
      ))}
      <Button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="contained"
        sx={{
          bgcolor: "#2a2a2a",
          color: "#ffffff",
          "&:hover": { bgcolor: "#3a3a3a" },
          "&:disabled": { bgcolor: "#1e1e1e", color: "#b0b0b0" },
          borderRadius: "9999px",
          px: 3,
          py: 1,
        }}
      >
        Trang sau
      </Button>
    </Box>
  );
};

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // Fixed page size as per original API call
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL; 
  // Lấy danh sách khóa học
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get(
          `${apiUrl}/lms/course?page=${currentPage - 1}&size=${pageSize}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data?.result) {
          setCourses(response.data.result.content);
          setTotalPages(response.data.result.totalPages || 1);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khóa học:", error.message);
      }
    };

    fetchCourses();
  }, [currentPage, pageSize]);

  // Chuyển đến trang sửa khóa học
  const handleEdit = (courseId) => {
    navigate(`/admin/course/${courseId}/edit`);
  };

  // Xóa khóa học
  const handleDelete = async (courseId) => {
    if (!window.confirm("Xác nhận xóa khóa học?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/lms/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prev) => prev.filter((course) => course.id !== courseId));
      // If the current page becomes empty, go to the previous page
      if (courses.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        // Refetch courses to update the list
        const response = await axios.get(
          `${apiUrl}/lms/course?page=${currentPage - 1}&size=${pageSize}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data?.result) {
          setCourses(response.data.result.content);
          setTotalPages(response.data.result.totalPages || 1);
        }
      }
    } catch (error) {
      console.error("Lỗi khi xóa khóa học:", error.message);
    }
  };

  // Chuyển đến trang thêm khóa học
  const handleAddCourse = () => {
    navigate("/admin/course/add");
  };

  // Cập nhật trạng thái khóa học
  const handleStatusChange = async (courseId, newStatus) => {
    if (!window.confirm(`Xác nhận thay đổi trạng thái thành ${newStatus}?`)) return;
    setLoadingStatus((prev) => ({ ...prev, [courseId]: true }));
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiUrl}/lms/course/${courseId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId ? { ...course, status: newStatus } : course
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error.message);
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  // Xử lý sự kiện onBlur
  const handleBlur = (event, courseId, currentStatus) => {
    if (!event || !event.target || !event.target.value) {
      console.warn("Sự kiện onBlur không có event, target hoặc value");
      return;
    }
    const selectedStatus = event.target.value;
    const validStatuses = ["PUBLIC", "PRIVATE", "HIDDEN"];
    if (!validStatuses.includes(selectedStatus)) {
      console.warn("Trạng thái không hợp lệ:", selectedStatus);
      return;
    }
    if (selectedStatus !== currentStatus) {
      handleStatusChange(courseId, selectedStatus);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 4, bgcolor: "#121212", minHeight: "100vh" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" sx={{ color: "#ffffff" }}>
            Quản lý khóa học
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCourse}
            sx={{
              bgcolor: "#ffffff",
              color: "#121212",
              "&:hover": { bgcolor: "#b0b0b0" },
            }}
          >
            Thêm khóa học
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ bgcolor: "#1e1e1e" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>
                  Hình ảnh
                </TableCell>
                <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>
                  Tiêu đề
                </TableCell>
                <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>
                  Giá
                </TableCell>
                <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{ color: "#ffffff", textAlign: "center" }}
                  >
                    Không có khóa học nào
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow
                    key={course.id}
                    sx={{ "&:hover": { bgcolor: "#2a2a2a" } }}
                  >
                    <TableCell
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={
                          course.thumbnailUrl || "/assets/images/placeholder.jpg"
                        }
                        alt={course.title}
                        style={{
                          width: "100px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>
                      {course.title}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>
                      {course.price.toLocaleString("vi-VN")} VNĐ
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>
                      <Select
                        value={course.status || "HIDDEN"}
                        onChange={(e) =>
                          handleStatusChange(course.id, e.target.value)
                        }
                        onBlur={(e) => handleBlur(e, course.id, course.status)}
                        disabled={loadingStatus[course.id]}
                        sx={{
                          color: "#ffffff",
                          bgcolor: "#2a2a2a",
                          "& .MuiSelect-icon": { color: "#ffffff" },
                          width: "150px",
                        }}
                      >
                        <MenuItem value="PUBLIC">Công khai</MenuItem>
                        <MenuItem value="PRIVATE">Riêng tư</MenuItem>
                        <MenuItem value="HIDDEN">Ẩn</MenuItem>
                      </Select>
                      {loadingStatus[course.id] && (
                        <CircularProgress
                          size={20}
                          sx={{ ml: 2, color: "#ffffff" }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEdit(course.id)}
                        sx={{ color: "#ffffff", borderColor: "#ffffff", mr: 1 }}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleDelete(course.id)}
                        sx={{ color: "#ff5555", borderColor: "#ff5555" }}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Box>
    </ThemeProvider>
  );
}

export default ManageCourses;