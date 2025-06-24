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

const API_BASE_URL =  import.meta.env.VITE_API_URL;

// Hàm lấy Bearer Token (thay đổi theo cách bạn lưu token)
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

// Fetch documents with pagination, search, and document type filter
async function getDocuments(page = 0, size = 3, search = '', documentIdType = '') {
  try {
    const url = new URL(`${API_BASE_URL}/lms/documents`);
    url.searchParams.append('page', page);
    url.searchParams.append('size', size);
    if (search) url.searchParams.append('search', search);
    if (documentIdType) url.searchParams.append('documentIdType', documentIdType);

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
    console.error('Lỗi khi lấy danh sách tài liệu:', error);
    return { content: [], totalPages: 0, totalElements: 0 };
  }
}

// Fetch document types
async function getDocumentTypes() {
  try {
    const response = await fetch(`${API_BASE_URL}/lms/document_types`, {
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
    console.error('Lỗi khi lấy danh sách loại tài liệu:', error);
    return [];
  }
}

// Create document
async function createDocument(document) {
  try {
    const response = await fetch(`${API_BASE_URL}/lms/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(document)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tạo tài liệu:', error);
    throw error;
  }
}

// Update document
async function updateDocument(id, document) {
  try {
    const response = await fetch(`${API_BASE_URL}/lms/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(document)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi sửa tài liệu:', error);
    throw error;
  }
}

// Delete document
async function deleteDocument(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/lms/documents/${id}`, {
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
    console.error('Lỗi khi xóa tài liệu:', error);
    throw error;
  }
}

// Create document type
async function createDocumentType(name) {
  try {
    const response = await fetch(`${API_BASE_URL}/lms/document_types?name=${encodeURIComponent(name)}`, {
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
    console.error('Lỗi khi tạo loại tài liệu:', error);
    throw error;
  }
}

function ManageDocuments() {
  // State cho danh sách tài liệu và phân trang
  const [documents, setDocuments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [filterDocumentTypeId, setFilterDocumentTypeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State cho dialog tạo/sửa tài liệu
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDocument, setCurrentDocument] = useState({
    id: null,
    title: '',
    fileUrl: '',
    documentTypeId: '',
    status: '0' // Mặc định là Public
  });
  const [formError, setFormError] = useState('');

  // State cho dialog tạo loại tài liệu
  const [openDocumentTypeDialog, setOpenDocumentTypeDialog] = useState(false);
  const [newDocumentTypeName, setNewDocumentTypeName] = useState('');

  // Hàm debounce để trì hoãn gọi API tìm kiếm
  const debouncedFetchDocuments = useCallback(
    debounce((page, rowsPerPage, search, documentTypeId) => {
      setLoading(true);
      getDocuments(page, rowsPerPage, search, documentTypeId)
        .then((documentData) => {
          setDocuments(documentData.content);
          setTotalElements(documentData.totalElements);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, 500),
    []
  );

  // Fetch documents và document types
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getDocuments(page, rowsPerPage, search, filterDocumentTypeId),
      getDocumentTypes()
    ]).then(([documentData, typesData]) => {
      setDocuments(documentData.content);
      setTotalElements(documentData.totalElements);
      setDocumentTypes(typesData);
      if (typesData.length > 0 && !currentDocument.documentTypeId) {
        setCurrentDocument(prev => ({ ...prev, documentTypeId: typesData[0].id }));
      }
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [page, rowsPerPage, filterDocumentTypeId]);

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
    debouncedFetchDocuments(page, rowsPerPage, value, filterDocumentTypeId);
  };

  // Mở dialog tạo tài liệu
  const handleOpenCreateDialog = () => {
    setIsEditMode(false);
    setCurrentDocument({
      id: null,
      title: '',
      fileUrl: '',
      documentTypeId: documentTypes.length > 0 ? documentTypes[0].id : '',
      status: '0'
    });
    setFormError('');
    setOpenDocumentDialog(true);
  };

  // Mở dialog sửa tài liệu
  const handleOpenEditDialog = (document) => {
    setIsEditMode(true);
    setCurrentDocument({
      id: document.id,
      title: document.title || '',
      fileUrl: document.fileUrl || '',
      documentTypeId: document.documentIdType || (documentTypes.length > 0 ? documentTypes[0].id : ''),
      status: document.status === 'PUBLIC' ? '0' : String(document.status) || '0'
    });
    setFormError('');
    setOpenDocumentDialog(true);
  };

  // Đóng dialog tạo/sửa tài liệu
  const handleCloseDocumentDialog = () => {
    setOpenDocumentDialog(false);
    setFormError('');
  };

  // Mở dialog tạo loại tài liệu
  const handleOpenDocumentTypeDialog = () => {
    setNewDocumentTypeName('');
    setFormError('');
    setOpenDocumentTypeDialog(true);
  };

  // Đóng dialog tạo loại tài liệu
  const handleCloseDocumentTypeDialog = () => {
    setOpenDocumentTypeDialog(false);
    setNewDocumentTypeName('');
    setFormError('');
  };

  // Xử lý tạo hoặc sửa tài liệu
  const handleSaveDocument = async () => {
    if (!currentDocument.title.trim()) {
      setFormError('Tiêu đề là bắt buộc');
      return;
    }
    if (!currentDocument.fileUrl.trim()) {
      setFormError('URL file là bắt buộc');
      return;
    }
    if (!currentDocument.documentTypeId) {
      setFormError('Vui lòng chọn loại tài liệu');
      return;
    }

    try {
      const documentPayload = {
        title: currentDocument.title,
        fileUrl: currentDocument.fileUrl,
        documentTypeId: parseInt(currentDocument.documentTypeId),
        status: parseInt(currentDocument.status)
      };
      if (isEditMode) {
        await updateDocument(currentDocument.id, documentPayload);
      } else {
        await createDocument(documentPayload);
      }
      handleCloseDocumentDialog();
      const documentData = await getDocuments(page, rowsPerPage, search, filterDocumentTypeId);
      setDocuments(documentData.content);
      setTotalElements(documentData.totalElements);
    } catch (error) {
      setFormError(error.message || `Lỗi khi ${isEditMode ? 'sửa' : 'tạo'} tài liệu`);
    }
  };

  // Xử lý xóa tài liệu
  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      return;
    }
    try {
      await deleteDocument(id);
      const documentData = await getDocuments(page, rowsPerPage, search, filterDocumentTypeId);
      setDocuments(documentData.content);
      setTotalElements(documentData.totalElements);
    } catch (error) {
      setError(error.message || 'Lỗi khi xóa tài liệu');
    }
  };

  // Xử lý tạo loại tài liệu
  const handleCreateDocumentType = async () => {
    if (!newDocumentTypeName.trim()) {
      setFormError('Tên loại tài liệu là bắt buộc');
      return;
    }

    try {
      const newType = await createDocumentType(newDocumentTypeName);
      setDocumentTypes(prev => [...prev, newType]);
      setCurrentDocument(prev => ({ ...prev, documentTypeId: newType.id }));
      handleCloseDocumentTypeDialog();
      const typesData = await getDocumentTypes();
      setDocumentTypes(typesData);
    } catch (error) {
      setFormError(error.message || 'Lỗi khi tạo loại tài liệu');
    }
  };

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  if (error && !openDocumentDialog && !openDocumentTypeDialog) {
    return <Typography color="error">Lỗi: {error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý Tài liệu
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
            <InputLabel>Loại Tài liệu</InputLabel>
            <Select
              value={filterDocumentTypeId}
              onChange={(e) => {
                setFilterDocumentTypeId(e.target.value);
                setPage(0);
              }}
              label="Loại Tài liệu"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {documentTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name || 'N/A'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
          Tạo Tài liệu
        </Button>
      </Box>

      {/* Bảng danh sách tài liệu */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>URL File</TableCell>
              <TableCell>ID Loại Tài liệu</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.length > 0 ? (
              documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>{document.id}</TableCell>
                  <TableCell>{document.title || 'N/A'}</TableCell>
                  <TableCell>{document.fileUrl || 'N/A'}</TableCell>
                  <TableCell>{document.documentIdType || 'N/A'}</TableCell>
                  <TableCell>
                    {document.status === 'PUBLIC' ? 'Public' : document.status || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenEditDialog(document)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteDocument(document.id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography>Không tìm thấy tài liệu</Typography>
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
        rowsPerPageOptions={[3, 5, 10]}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
      />

      {/* Dialog tạo/sửa tài liệu */}
      <Dialog open={openDocumentDialog} onClose={handleCloseDocumentDialog}>
        <DialogTitle>{isEditMode ? 'Sửa Tài liệu' : 'Tạo Tài liệu Mới'}</DialogTitle>
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
            value={currentDocument.title}
            onChange={(e) => setCurrentDocument({ ...currentDocument, title: e.target.value })}
            required
            error={!!formError && !currentDocument.title.trim()}
            helperText={!!formError && !currentDocument.title.trim() ? 'Tiêu đề là bắt buộc' : ''}
          />
          <TextField
            label="URL File"
            fullWidth
            margin="dense"
            value={currentDocument.fileUrl}
            onChange={(e) => setCurrentDocument({ ...currentDocument, fileUrl: e.target.value })}
            required
            error={!!formError && !currentDocument.fileUrl.trim()}
            helperText={!!formError && !currentDocument.fileUrl.trim() ? 'URL file là bắt buộc' : ''}
          />
          <FormControl fullWidth margin="dense" error={!!formError && !currentDocument.documentTypeId}>
            <InputLabel>Loại Tài liệu</InputLabel>
            <Select
              value={currentDocument.documentTypeId}
              onChange={(e) => {
                if (e.target.value === 'create_new') {
                  handleOpenDocumentTypeDialog();
                } else {
                  setCurrentDocument({ ...currentDocument, documentTypeId: e.target.value });
                }
              }}
              label="Loại Tài liệu"
            >
              {documentTypes.length === 0 ? (
                <MenuItem value="">Không có loại tài liệu</MenuItem>
              ) : (
                documentTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name || 'N/A'}
                  </MenuItem>
                ))
              )}
              <MenuItem value="create_new">Tạo loại tài liệu mới</MenuItem>
            </Select>
            {!!formError && !currentDocument.documentTypeId && (
              <Typography color="error" variant="caption">
                Vui lòng chọn loại tài liệu
              </Typography>
            )}
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={currentDocument.status}
              onChange={(e) => setCurrentDocument({ ...currentDocument, status: e.target.value })}
              label="Trạng thái"
            >
              <MenuItem value="0">Public</MenuItem>
              <MenuItem value="1">Private</MenuItem>
              <MenuItem value="2">Hidden</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDocumentDialog}>Hủy</Button>
          <Button onClick={handleSaveDocument} variant="contained" color="primary">
            {isEditMode ? 'Sửa' : 'Tạo'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog tạo loại tài liệu */}
      <Dialog open={openDocumentTypeDialog} onClose={handleCloseDocumentTypeDialog}>
        <DialogTitle>Tạo Loại Tài liệu Mới</DialogTitle>
        <DialogContent>
          {formError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {formError}
            </Typography>
          )}
          <TextField
            label="Tên Loại Tài liệu"
            fullWidth
            margin="dense"
            value={newDocumentTypeName}
            onChange={(e) => setNewDocumentTypeName(e.target.value)}
            required
            error={!!formError && !newDocumentTypeName.trim()}
            helperText={!!formError && !newDocumentTypeName.trim() ? 'Tên loại tài liệu là bắt buộc' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDocumentTypeDialog}>Hủy</Button>
          <Button onClick={handleCreateDocumentType} variant="contained" color="primary">
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageDocuments;