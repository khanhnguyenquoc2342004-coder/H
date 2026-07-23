export default {
  isLoggedIn: !!localStorage.getItem('token'),
  userRole: localStorage.getItem('role') || '',
  hotels: [],
  users: []
};