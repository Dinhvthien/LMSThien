import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  TablePagination,
  InputLabel,
  FormControl,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Giả định lấy Bearer Token từ localStorage (thay đổi theo cách bạn lưu token)
const getAuthToken = () => {
  return localStorage.getItem('token') || 'your_bearer_token_here';
};

// Hàm debounce thủ công
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Fetch videos with pagination, search, and video type filter
async function getVideos(page = 0, size = 2, search = '', videoIdType = '') {
  try {
    const url = new URL(`${API_BASE_URL}/lms/videos`);
    url.searchParams.append('page', page);
    url.searchParams.append('size', size);
    if (search) url.searchParams.append('search', search);
    if (videoIdType) url.searchParams.append('videoIdType', videoIdType);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return {
      content: Array.isArray(data.result.content) ? data.result.content : [],
      totalPages: data.result.totalPages || 0,
      totalElements: data.result.totalElements || 0
    };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách video:', error);
    return { content: [], totalPages: 0, totalElements: 0 };
  }
}

// Fetch video types
async function getVideoTypes() {
  try {
    const response = await fetch(`${API_BASE_URL}/lms/video_types`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data.result) ? data.result : [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách loại video:', error);
    return [];
  }
}

// Create video
async function createVideo(video) {
  try {
    const response = await fetch(`${API_BASE_URL}/lms/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(video)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tạo video:', error);
    throw error;
  }
}

// Update video
async function updateVideo(id, video) {
  try {
    const response = await fetch(`${API_BASE_URL}/lms/videos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(video)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi sửa video:', error);
    throw error;
  }
}

// Delete video
async function deleteVideo(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/lms/videos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa video:', error);
    throw error;
  }
}

// Create video type
async function createVideoType(name) {
  try {
    const response = await fetch(`${API_BASE_URL}/lms/video_types?name=${encodeURIComponent(name)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tạo loại video:', error);
    throw error;
  }
}

function ManageVideos() {
  // State cho danh sách video và phân trang
  const [videos, setVideos] = useState([]);
  const [videoTypes, setVideoTypes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [filterVideoTypeId, setFilterVideoTypeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State cho dialog tạo/sửa video
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({
    id: null,
    title: '',
    videoUrl: '',
    duration: '',
    idVideoType: '',
    status: '1'
  });
  const [formError, setFormError] = useState('');

  // State cho dialog tạo video type
  const [openVideoTypeDialog, setOpenVideoTypeDialog] = useState(false);
  const [newVideoTypeName, setNewVideoTypeName] = useState('');

  // Hàm debounce để trì hoãn gọi API tìm kiếm
  const debouncedFetchVideos = useCallback(
    debounce((page, rowsPerPage, search, videoTypeId) => {
      setLoading(true);
      getVideos(page, rowsPerPage, search, videoTypeId)
        .then((videoData) => {
          setVideos(videoData.content);
          setTotalElements(videoData.totalElements);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, 500),
    []
  );

  // Fetch videos và video types
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getVideos(page, rowsPerPage, search, filterVideoTypeId),
      getVideoTypes()
    ]).then(([videoData, typesData]) => {
      setVideos(videoData.content);
      setTotalElements(videoData.totalElements);
      setVideoTypes(typesData);
      if (typesData.length > 0 && !currentVideo.idVideoType) {
        setCurrentVideo(prev => ({ ...prev, idVideoType: typesData[0].id }));
      }
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [page, rowsPerPage, filterVideoTypeId]);

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xử lý thay đổi tìm kiếm
  const handleSearchChange = (value) => {
    setSearch(value);
    debouncedFetchVideos(page, rowsPerPage, value, filterVideoTypeId);
  };

  // Mở dialog tạo video
  const handleOpenCreateDialog = () => {
    setIsEditMode(false);
    setCurrentVideo({
      id: null,
      title: '',
      videoUrl: '',
      duration: '',
      idVideoType: videoTypes.length > 0 ? videoTypes[0].id : '',
      status: '1'
    });
    setFormError('');
    setOpenVideoDialog(true);
  };

  // Mở dialog sửa video
  const handleOpenEditDialog = (video) => {
    setIsEditMode(true);
    setCurrentVideo({
      id: video.id,
      title: video.title || '',
      videoUrl: video.videoUrl || '',
      duration: video.duration || '',
      idVideoType: video.videoIdType || (videoTypes.length > 0 ? videoTypes[0].id : ''),
      status: video.status === 'PUBLIC' ? '0' : String(video.status) || '1'
    });
    setFormError('');
    setOpenVideoDialog(true);
  };

  // Đóng dialog tạo/sửa video
  const handleCloseVideoDialog = () => {
    setOpenVideoDialog(false);
    setFormError('');
  };

  // Mở dialog tạo video type
  const handleOpenVideoTypeDialog = () => {
    setNewVideoTypeName('');
    setFormError('');
    setOpenVideoTypeDialog(true);
  };

  // Đóng dialog tạo video type
  const handleCloseVideoTypeDialog = () => {
    setOpenVideoTypeDialog(false);
    setNewVideoTypeName('');
    setFormError('');
  };

  // Xử lý tạo hoặc sửa video
  const handleSaveVideo = async () => {
    if (!currentVideo.title.trim()) {
      setFormError('Tiêu đề là bắt buộc');
      return;
    }
    if (!currentVideo.videoUrl.trim()) {
      setFormError('URL video là bắt buộc');
      return;
    }
    if (!currentVideo.duration || isNaN(currentVideo.duration) || parseInt(currentVideo.duration) <= 0) {
      setFormError('Thời lượng phải là số dương (giây)');
      return;
    }
    if (!currentVideo.idVideoType) {
      setFormError('Vui lòng chọn loại video');
      return;
    }

    try {
      const videoPayload = {
        title: currentVideo.title,
        videoUrl: currentVideo.videoUrl,
        duration: parseInt(currentVideo.duration),
        idVideoType: parseInt(currentVideo.idVideoType),
        status: parseInt(currentVideo.status)
      };
      if (isEditMode) {
        await updateVideo(currentVideo.id, videoPayload);
      } else {
        await createVideo(videoPayload);
      }
      handleCloseVideoDialog();
      const videoData = await getVideos(page, rowsPerPage, search, filterVideoTypeId);
      setVideos(videoData.content);
      setTotalElements(videoData.totalElements);
    } catch (error) {
      setFormError(error.message || `Lỗi khi ${isEditMode ? 'sửa' : 'tạo'} video`);
    }
  };

  // Xử lý xóa video
  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa video này?')) {
      return;
    }
    try {
      await deleteVideo(id);
      const videoData = await getVideos(page, rowsPerPage, search, filterVideoTypeId);
      setVideos(videoData.content);
      setTotalElements(videoData.totalElements);
    } catch (error) {
      setError(error.message || 'Lỗi khi xóa video');
    }
  };

  // Xử lý tạo video type
  const handleCreateVideoType = async () => {
    if (!newVideoTypeName.trim()) {
      setFormError('Tên loại video là bắt buộc');
      return;
    }

    try {
      const newType = await createVideoType(newVideoTypeName);
      setVideoTypes(prev => [...prev, newType]);
      setCurrentVideo(prev => ({ ...prev, idVideoType: newType.id }));
      handleCloseVideoTypeDialog();
      const typesData = await getVideoTypes();
      setVideoTypes(typesData);
    } catch (error) {
      setFormError(error.message || 'Lỗi khi tạo loại video');
    }
  };

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  if (error && !openVideoDialog && !openVideoTypeDialog) {
    return <Typography color="error">Lỗi: {error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý Video
      </Typography>
      {/* Thanh tìm kiếm và lọc */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{ width: 200 }}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Loại Video</InputLabel>
            <Select
              value={filterVideoTypeId}
              onChange={(e) => {
                setFilterVideoTypeId(e.target.value);
                setPage(0);
              }}
              label="Loại Video"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {videoTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name || 'N/A'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
          Tạo Video
        </Button>
      </Box>

      {/* Bảng danh sách video */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>URL Video</TableCell>
              <TableCell>ID Loại Video</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thời lượng (phút)</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.length > 0 ? (
              videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>{video.id}</TableCell>
                  <TableCell>{video.title || 'N/A'}</TableCell>
                  <TableCell>{video.videoUrl || 'N/A'}</TableCell>
                  <TableCell>{video.videoIdType || 'N/A'}</TableCell>
                  <TableCell>
                    {video.status === 'PUBLIC' ? 'Public' : video.status || 'N/A'}
                  </TableCell>
                  <TableCell>{video.duration || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenEditDialog(video)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteVideo(video.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>Không tìm thấy video</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[2, 5, 10]}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
      />

      {/* Dialog tạo/sửa video */}
      <Dialog open={openVideoDialog} onClose={handleCloseVideoDialog}>
        <DialogTitle>{isEditMode ? 'Sửa Video' : 'Tạo Video Mới'}</DialogTitle>
        <DialogContent>
          {formError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {formError}
            </Typography>
          )}
          <TextField
            label="Tiêu đề"
            fullWidth
            margin="dense"
            value={currentVideo.title}
            onChange={(e) => setCurrentVideo({ ...currentVideo, title: e.target.value })}
            required
            error={!!formError && !currentVideo.title.trim()}
            helperText={!!formError && !currentVideo.title.trim() ? 'Tiêu đề là bắt buộc' : ''}
          />
          <TextField
            label="URL Video"
            fullWidth
            margin="dense"
            value={currentVideo.videoUrl}
            onChange={(e) => setCurrentVideo({ ...currentVideo, videoUrl: e.target.value })}
            required
            error={!!formError && !currentVideo.videoUrl.trim()}
            helperText={!!formError && !currentVideo.videoUrl.trim() ? 'URL video là bắt buộc' : ''}
          />
          <TextField
            label="Thời lượng (giây)"
            type="number"
            fullWidth
            margin="dense"
            value={currentVideo.duration}
            onChange={(e) => setCurrentVideo({ ...currentVideo, duration: e.target.value })}
            required
            error={!!formError && (isNaN(currentVideo.duration) || parseInt(currentVideo.duration) <= 0)}
            helperText={
              !!formError && (isNaN(currentVideo.duration) || parseInt(currentVideo.duration) <= 0)
                ? 'Thời lượng phải là số dương'
                : ''
            }
          />
          <FormControl fullWidth margin="dense" error={!!formError && !currentVideo.idVideoType}>
            <InputLabel>Loại Video</InputLabel>
            <Select
              value={currentVideo.idVideoType}
              onChange={(e) => {
                if (e.target.value === 'create_new') {
                  handleOpenVideoTypeDialog();
                } else {
                  setCurrentVideo({ ...currentVideo, idVideoType: e.target.value });
                }
              }}
              label="Loại Video"
            >
              {videoTypes.length === 0 ? (
                <MenuItem value="">Không có loại video</MenuItem>
              ) : (
                videoTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name || 'N/A'}
                  </MenuItem>
                ))
              )}
              <MenuItem value="create_new">Tạo loại video mới</MenuItem>
            </Select>
            {!!formError && !currentVideo.idVideoType && (
              <Typography color="error" variant="caption">
                Vui lòng chọn loại video
              </Typography>
            )}
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={currentVideo.status}
              onChange={(e) => setCurrentVideo({ ...currentVideo, status: e.target.value })}
              label="Trạng thái"
            >
              <MenuItem value="0">Public</MenuItem>
              <MenuItem value="1">Private</MenuItem>
              <MenuItem value="2">Hidden</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVideoDialog}>Hủy</Button>
          <Button onClick={handleSaveVideo} variant="contained" color="primary">
            {isEditMode ? 'Sửa' : 'Tạo'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog tạo video type */}
      <Dialog open={openVideoTypeDialog} onClose={handleCloseVideoTypeDialog}>
        <DialogTitle>Tạo Loại Video Mới</DialogTitle>
        <DialogContent>
          {formError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {formError}
            </Typography>
          )}
          <TextField
            label="Tên Loại Video"
            fullWidth
            margin="dense"
            value={newVideoTypeName}
            onChange={(e) => setNewVideoTypeName(e.target.value)}
            required
            error={!!formError && !newVideoTypeName.trim()}
            helperText={!!formError && !newVideoTypeName.trim() ? 'Tên loại video là bắt buộc' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVideoTypeDialog}>Hủy</Button>
          <Button onClick={handleCreateVideoType} variant="contained" color="primary">
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageVideos;