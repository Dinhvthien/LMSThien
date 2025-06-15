import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const CourseInfo = ({ course, setCourse, courseTypes }) => {
  const [formData, setFormData] = useState({
    title: course.title || "",
    description: course.description || "",
    thumbnailUrl: course.thumbnailUrl || "",
    price: course.price || 0,
    status: course.status || "HIDDEN", // Đảm bảo khởi tạo với course.status
    courseTypeId: course.courseTypeId || "", // Đảm bảo khởi tạo với course.courseTypeId
  });
  const [loading, setLoading] = useState(false);

  // Cập nhật formData khi course hoặc courseTypes thay đổi
  useEffect(() => {
    setFormData({
      title: course.title || "",
      description: course.description || "",
      thumbnailUrl: course.thumbnailUrl || "",
      price: course.price || 0,
      status: course.status || "HIDDEN", // Cập nhật status
      courseTypeId: course.courseTypeId || "", // Cập nhật courseTypeId
    });
    if (course.courseTypeId && courseTypes.length > 0) {
      const validType = courseTypes.find((type) => type.id === course.courseTypeId);
      if (!validType) {
        console.warn(`courseTypeId ${course.courseTypeId} không tồn tại trong courseTypes`);
      }
    }
  }, [course, courseTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.put(
        `${apiUrl}/lms/course/${course.id}`,
        {
          ...formData,
          price: parseFloat(formData.price),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data && response.data.result) {
        setCourse(response.data.result);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật khóa học:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Thông tin khóa học
      </Typography>
      <TextField
        fullWidth
        label="Tiêu đề"
        name="title"
        value={formData.title}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        sx={{ bgcolor: "#1e1e1e" }}
      />
      <TextField
        fullWidth
        label="Mô tả"
        name="description"
        value={formData.description}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        multiline
        rows={4}
        sx={{ bgcolor: "#1e1e1e" }}
      />
      <TextField
        fullWidth
        label="URL hình ảnh"
        name="thumbnailUrl"
        value={formData.thumbnailUrl}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        sx={{ bgcolor: "#1e1e1e" }}
      />
      <TextField
        fullWidth
        label="Giá (VNĐ)"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        sx={{ bgcolor: "#1e1e1e" }}
      />
      <FormControl fullWidth margin="normal" sx={{ bgcolor: "#1e1e1e" }}>
        <InputLabel>Trạng thái</InputLabel>
        <Select
          name="status"
          value={formData.status}
          onChange={handleChange}
          label="Trạng thái"
        >
          <MenuItem value="PUBLIC">Công khai</MenuItem>
          <MenuItem value="PRIVATE">Riêng tư</MenuItem>
          <MenuItem value="HIDDEN">Ẩn</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal" sx={{ bgcolor: "#1e1e1e" }}>
        <InputLabel>Loại khóa học</InputLabel>
        <Select
          name="courseTypeId"
          value={formData.courseTypeId}
          onChange={handleChange}
          label="Loại khóa học"
          disabled={!Array.isArray(courseTypes) || courseTypes.length === 0}
        >
          {Array.isArray(courseTypes) && courseTypes.length > 0 ? (
            courseTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              Không có loại khóa học
            </MenuItem>
          )}
        </Select>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ mt: 2, bgcolor: "#ffffff", color: "#121212", "&:hover": { bgcolor: "#b0b0b0" } }}
      >
        {loading ? <CircularProgress size={24} /> : "Cập nhật khóa học"}
      </Button>
    </Box>
  );
};

export default CourseInfo;