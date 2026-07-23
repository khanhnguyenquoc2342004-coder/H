import api from '../services/api';

export default { 
  async login({ commit }, payload) {
    const res = await api.post('/auth/login', payload);
    commit('SET_AUTH', { 
      token: res.data.token, 
      role: res.data.role || 'USER' 
    });
  },   
  
  async fetchHotels({ state, commit }, forceRefresh = false) {
    if (!forceRefresh && state.hotels.length > 0) return state.hotels; 
    try {
        const res = await api.get('/hotels');
        commit('SET_HOTELS', res.data);
        return res.data; 
    } catch (error) {
        console.error("Lỗi lấy danh sách khách sạn:", error);
        throw error; 
    }
  },
  
  async saveHotel({ dispatch }, payload) {
    if (payload.id) {
      await api.put(`/hotels/${payload.id}`, payload);
    } else {
      const { id, ...dataToPost } = payload; 
      await api.post('/hotels', dataToPost);
    }
    
    await dispatch('fetchHotels', true); 
  },
  
  async deleteHotel({ dispatch }, id) {
    await api.delete(`/hotels/${id}`);
    await dispatch('fetchHotels', true); 
  },
  
  async fetchUsers({ state, commit }, forceRefresh = false) {
      if (!forceRefresh && state.users.length > 0) return; 
      try {
          const response = await api.get('/users');
          commit('SET_USERS', response.data);
      } catch (error) {
          console.error("Lỗi lấy danh sách người dùng:", error);
      }
  },
  
  async saveUser({ dispatch }, payload) {
    if (payload.isEditMode) {
      await api.put(`/users/${payload.id}`, { username: payload.username, password: payload.password });  
    } else {
      await api.post('/auth/register', { username: payload.username, password: payload.password });
    }
    await dispatch('fetchUsers', true);
  },

  async deleteUser({ dispatch }, id) {
    await api.delete(`/users/${id}`);
    await dispatch('fetchUsers', true);
  },

    
  async logout({ commit }) {
      commit('LOGOUT');
  }
};