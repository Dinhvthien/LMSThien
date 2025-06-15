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
  Collapse,
} from "@mui/material";
import { Add, Edit, Delete, ExpandMore, ExpandLess } from "@mui/icons-material";

const LessonManager = ({ sectionId, lessons = [], setCourse }) => {
  const [newLesson, setNewLesson] = useState({
    title: "",
    videoUrl: "",
    documentUrl: "",
    duration: "",
    sortOrder: lessons.length > 0 ? Math.max(...lessons.map((l) => l.sortOrder)) + 1 : 1,
  });
  const [editingLesson, setEditingLesson] = useState(null);
  const [expanded, setExpanded] = useState(true);
const apiUrl = import.meta.env.VITE_API_URL;
  const handleAddLesson = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${apiUrl}/lms/lesson`,
        { sectionId, ...newLesson, sortOrder: parseInt(newLesson.sortOrder) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse((prev) => ({
        ...prev,
        sections: (prev.sections || []).map((s) =>
          s.id === sectionId
            ? { ...s, lessons: [...(s.lessons || []), response.data.result] }
            : s
        ),
      }));
      setNewLesson({
        title: "",
        videoUrl: "",
        documentUrl: "",
        duration: "",
        sortOrder: newLesson.sortOrder + 1,
      });
    } catch (err) {
      console.error("Lỗi khi thêm lesson:", err.message);
    }
  };

  const handleEditLesson = async (lessonId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${apiUrl}/lms/lesson/${lessonId}`,
        { ...editingLesson, sortOrder: parseInt(editingLesson.sortOrder) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse((prev) => ({
        ...prev,
        sections: (prev.sections || []).map((s) =>
          s.id === sectionId
            ? {
                ...s,
                lessons: (s.lessons || []).map((l) =>
                  l.id === lessonId ? response.data.result : l
                ),
              }
            : s
        ),
      }));
      setEditingLesson(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật lesson:", err.message);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Xác nhận xóa lesson?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/lms/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse((prev) => ({
        ...prev,
        sections: (prev.sections || []).map((s) =>
          s.id === sectionId
            ? { ...s, lessons: (s.lessons || []).filter((l) => l.id !== lessonId) }
            : s
        ),
      }));
    } catch (err) {
      console.error("Lỗi khi xóa lesson:", err.message);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle2">Bài học</Typography>
        <IconButton onClick={() => setExpanded(!expanded)} sx={{ color: "#ffffff" }}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      <Collapse in={expanded}>
        <Card sx={{ mb: 2, bgcolor: "#2a2a2a" }}>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Tiêu đề Lesson"
                value={newLesson.title}
                onChange={(e) =>
                  setNewLesson((prev) => ({ ...prev, title: e.target.value }))
                }
                variant="outlined"
                InputLabelProps={{ style: { color: "#b0b0b0" } }}
                InputProps={{ style: { color: "#ffffff" } }}
              />
              <TextField
                label="Video URL"
                value={newLesson.videoUrl}
                onChange={(e) =>
                  setNewLesson((prev) => ({ ...prev, videoUrl: e.target.value }))
                }
                variant="outlined"
                InputLabelProps={{ style: { color: "#b0b0b0" } }}
                InputProps={{ style: { color: "#ffffff" } }}
              />
              <TextField
                label="Document URL"
                value={newLesson.documentUrl}
                onChange={(e) =>
                  setNewLesson((prev) => ({ ...prev, documentUrl: e.target.value }))
                }
                variant="outlined"
                InputLabelProps={{ style: { color: "#b0b0b0" } }}
                InputProps={{ style: { color: "#ffffff" } }}
              />
              <TextField
                label="Thời lượng"
                value={newLesson.duration}
                onChange={(e) =>
                  setNewLesson((prev) => ({ ...prev, duration: e.target.value }))
                }
                variant="outlined"
                InputLabelProps={{ style: { color: "#b0b0b0" } }}
                InputProps={{ style: { color: "#ffffff" } }}
              />
              <TextField
                label="Thứ tự"
                type="number"
                value={newLesson.sortOrder}
                onChange={(e) =>
                  setNewLesson((prev) => ({ ...prev, sortOrder: e.target.value }))
                }
                variant="outlined"
                InputLabelProps={{ style: { color: "#b0b0b0" } }}
                InputProps={{ style: { color: "#ffffff" } }}
              />
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddLesson}
                sx={{ bgcolor: "#ffffff", color: "#121212", "&:hover": { bgcolor: "#b0b0b0" } }}
              >
                Thêm
              </Button>
            </Box>
          </CardContent>
        </Card>
        {lessons.map((lesson) => (
          <Card key={lesson.id} sx={{ mb: 1, bgcolor: "#2a2a2a" }}>
            <CardContent>
              {editingLesson && editingLesson.id === lesson.id ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Tiêu đề Lesson"
                    value={editingLesson.title}
                    onChange={(e) =>
                      setEditingLesson((prev) => ({ ...prev, title: e.target.value }))
                    }
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#b0b0b0" } }}
                    InputProps={{ style: { color: "#ffffff" } }}
                  />
                  <TextField
                    label="Video URL"
                    value={editingLesson.videoUrl}
                    onChange={(e) =>
                      setEditingLesson((prev) => ({ ...prev, videoUrl: e.target.value }))
                    }
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#b0b0b0" } }}
                    InputProps={{ style: { color: "#ffffff" } }}
                  />
                  <TextField
                    label="Document URL"
                    value={editingLesson.documentUrl}
                    onChange={(e) =>
                      setEditingLesson((prev) => ({ ...prev, documentUrl: e.target.value }))
                    }
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#b0b0b0" } }}
                    InputProps={{ style: { color: "#ffffff" } }}
                  />
                  <TextField
                    label="Thời lượng"
                    value={editingLesson.duration}
                    onChange={(e) =>
                      setEditingLesson((prev) => ({ ...prev, duration: e.target.value }))
                    }
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#b0b0b0" } }}
                    InputProps={{ style: { color: "#ffffff" } }}
                  />
                  <TextField
                    label="Thứ tự"
                    type="number"
                    value={editingLesson.sortOrder}
                    onChange={(e) =>
                      setEditingLesson((prev) => ({ ...prev, sortOrder: e.target.value }))
                    }
                    variant="outlined"
                    InputLabelProps={{ style: { color: "#b0b0b0" } }}
                    InputProps={{ style: { color: "#ffffff" } }}
                  />
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleEditLesson(lesson.id)}
                      sx={{ bgcolor: "#ffffff", color: "#121212" }}
                    >
                      Lưu
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditingLesson(null)}
                      sx={{ color: "#ffffff", borderColor: "#ffffff" }}
                    >
                      Hủy
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="subtitle2">{lesson.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Thứ tự: {lesson.sortOrder} | Thời lượng: {lesson.duration || "N/A"}
                    </Typography>
                    {lesson.videoUrl && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Video: <a href={lesson.videoUrl} target="_blank">{lesson.videoUrl}</a>
                      </Typography>
                    )}
                    {lesson.documentUrl && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Tài liệu: <a href={lesson.documentUrl} target="_blank">{lesson.documentUrl}</a>
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <IconButton
                      onClick={() => setEditingLesson({ ...lesson })}
                      sx={{ color: "#ffffff" }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteLesson(lesson.id)}
                      sx={{ color: "#ffffff" }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                )}
              </CardContent>
          </Card>
        ))}
      </Collapse>
    </Box>
  );
};

export default LessonManager;