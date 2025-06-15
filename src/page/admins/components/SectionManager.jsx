import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import LessonManager from "./LessonManager";

const SectionManager = ({ courseId, sections = [], setCourse }) => {
  const [newSection, setNewSection] = useState({
    title: "",
    sortOrder: sections.length > 0 ? Math.max(...sections.map((s) => s.sortOrder)) + 1 : 1,
  });
  const [editingSection, setEditingSection] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL; 
  const handleAddSection = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${apiUrl}/lms/course-sections`,
        { courseId, ...newSection, sortOrder: parseInt(newSection.sortOrder) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse((prev) => ({
        ...prev,
        sections: [...(prev.sections || []), response.data.result],
      }));
      setNewSection({
        title: "",
        sortOrder: newSection.sortOrder + 1,
      });
    } catch (err) {
      console.error("Lỗi khi thêm section:", err.response?.data || err.message);
    }
  };

  const handleEditSection = async (sectionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${apiUrl}/lms/course-sections/${sectionId}`,
        { ...editingSection, sortOrder: parseInt(editingSection.sortOrder) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse((prev) => ({
        ...prev,
        sections: (prev.sections || []).map((s) =>
          s.id === sectionId ? response.data.result : s
        ),
      }));
      setEditingSection(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật section:", err.response?.data || err.message);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Xác nhận xóa section?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/lms/course-sections/${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse((prev) => ({
        ...prev,
        sections: (prev.sections || []).filter((s) => s.id !== sectionId),
      }));
    } catch (err) {
      console.error("Lỗi khi xóa section:", err.response?.data || err.message);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Quản lý Section
      </Typography>
      <Card sx={{ mb: 2, bgcolor: "#1e1e1e" }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              label="Tiêu đề Section"
              value={newSection.title}
              onChange={(e) =>
                setNewSection((prev) => ({ ...prev, title: e.target.value }))
              }
              variant="outlined"
              InputLabelProps={{ style: { color: "#b0b0b0" } }}
              InputProps={{ style: { color: "#ffffff" } }}
            />
            <TextField
              label="Thứ tự"
              type="number"
              value={newSection.sortOrder}
              onChange={(e) =>
                setNewSection((prev) => ({ ...prev, sortOrder: e.target.value }))
              }
              variant="outlined"
              InputLabelProps={{ style: { color: "#b0b0b0" } }}
              InputProps={{ style: { color: "#ffffff" } }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddSection}
              sx={{ bgcolor: "#ffffff", color: "#121212", "&:hover": { bgcolor: "#b0b0b0" } }}
            >
              Thêm
            </Button>
          </Box>
        </CardContent>
      </Card>
      {sections.map((section) => (
        <Card key={section.id} sx={{ mb: 2, bgcolor: "#1e1e1e" }}>
          <CardContent>
            {editingSection && editingSection.id === section.id ? (
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  label="Tiêu đề Section"
                  value={editingSection.title}
                  onChange={(e) =>
                    setEditingSection((prev) => ({ ...prev, title: e.target.value }))
                  }
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#b0b0b0" } }}
                  InputProps={{ style: { color: "#ffffff" } }}
                />
                <TextField
                  label="Thứ tự"
                  type="number"
                  value={editingSection.sortOrder}
                  onChange={(e) =>
                    setEditingSection((prev) => ({ ...prev, sortOrder: e.target.value }))
                  }
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#b0b0b0" } }}
                  InputProps={{ style: { color: "#ffffff" } }}
                />
                <Button
                  variant="contained"
                  onClick={() => handleEditSection(section.id)}
                  sx={{ bgcolor: "#ffffff", color: "#121212" }}
                >
                  Lưu
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setEditingSection(null)}
                  sx={{ color: "#ffffff", borderColor: "#ffffff" }}
                >
                  Hủy
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1">
                  {section.title} (Thứ tự: {section.sortOrder})
                </Typography>
                <Box>
                  <IconButton
                    onClick={() => setEditingSection({ ...section})}
                    sx={{ color: "#ffffff" }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteSection(section.id)}
                    sx={{ color: "#ffffff" }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            )}
            <LessonManager sectionId={section.id} lessons={section.lessons || []} setCourse={setCourse} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default SectionManager;