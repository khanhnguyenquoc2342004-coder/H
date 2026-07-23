// Hàm hỗ trợ chuẩn hóa tiếng Việt không dấu (dùng nội bộ trong file này)
const removeAccents = (str) => {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

export default {
  formattedHotels: (state) => {
    return state.hotels.map(hotel => {
      let imagesArray = [];
      
      if (Array.isArray(hotel.images)) {
        imagesArray = hotel.images;
      } else if (typeof hotel.imageUrl === 'string' && hotel.imageUrl.includes(',')) {
        // Nếu là chuỗi có chứa dấu phẩy thì cắt ra thành mảng
        imagesArray = hotel.imageUrl.split(',').map(url => url.trim());
      } else if (typeof hotel.imageUrl === 'string' && hotel.imageUrl) {
        // Nếu chỉ có 1 ảnh thì cho luôn vào mảng
        imagesArray = [hotel.imageUrl];
      }
      
      return { ...hotel, images: imagesArray };
    });
  },
  

  searchHotels: (state, getters) => (keyword) => {

    const allFormatted = getters.formattedHotels; 
    
    const kw = removeAccents(keyword.trim());
    if (!kw) return allFormatted; 

    // Thực hiện lọc
    return allFormatted.filter(hotel => 
      removeAccents(hotel.name || '').includes(kw) || 
      removeAccents(hotel.address || '').includes(kw)
    );
  }
}; 