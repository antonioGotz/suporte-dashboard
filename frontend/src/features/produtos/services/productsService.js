import api from '../../../services/api';

// Função de upload usando o http centralizado
const uploadFile = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    // O http já inclui withCredentials e headers globais
    const response = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.filePath;
};

export const getAllProducts = (page = 1, sortConfig = { key: 'id', direction: 'desc' }) => {
    const params = new URLSearchParams({ page, sort: sortConfig.key, order: sortConfig.direction });
    return api.get(`/admin/products?${params.toString()}`);
};

export const getProductById = (productId) => {
    return api.get(`/admin/products/${productId}`);
};

export const createProduct = async (productData, imageFile, videoFile) => {
    const imageUrl = await uploadFile(imageFile);
    const videoUrl = await uploadFile(videoFile);
    const finalData = { ...productData, image: imageUrl, video: videoUrl };
    return api.post('/admin/products', finalData);
};

export const updateProduct = async (productId, productData, imageFile, videoFile) => {
    const finalData = { ...productData };
    if (imageFile) {
        finalData.image = await uploadFile(imageFile);
    }
    if (videoFile) {
        finalData.video = await uploadFile(videoFile);
    }
    return api.put(`/admin/products/${productId}`, finalData);
};

export const deleteProductById = (productId) => {
    return api.delete(`/admin/products/${productId}`);
};

export const getSubscriptionPlans = () => {
    return api.get('/admin/products/plans');
};

// Compat: export default com a interface utilizada pela AssinantesPage
const productsService = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProductById,
    getSubscriptionPlans,
};

export default productsService;
