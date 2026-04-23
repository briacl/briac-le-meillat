export const useAuthStore = {
  getState: () => ({
    loginAsDemo: () => console.log('Mock: loginAsDemo'),
    isAuthenticated: false,
  }),
  isAuthenticated: false,
};
