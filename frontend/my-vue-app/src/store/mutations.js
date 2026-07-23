export default {
  SET_AUTH(state, { token, role }) {
  state.isLoggedIn = true;
  state.userRole = role;
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  },
  SET_USERS(state, users) {
    state.users = users; // Mutation để cập nhật danh sách users
  },

  LOGOUT(state) {
  state.isLoggedIn = false;
  state.userRole = '';
  localStorage.clear();
  },
  SET_HOTELS(state, hotels) {
  state.hotels = hotels;
  }
};