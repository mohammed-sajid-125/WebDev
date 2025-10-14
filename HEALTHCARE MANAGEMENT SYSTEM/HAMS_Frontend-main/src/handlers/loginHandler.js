import { loginUser } from '../apiControllers/userAPI';

export default async function handleUserLogin(formData, role, login) {
  try {
    const response = await loginUser(formData, role, login);
    console.log('Login successful:', response);
    if (response?.token) {
      localStorage.setItem('token', response.token);
    } else {
      throw new Error('No token received from server.');
    }
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed. Please check your credentials.');
  }
}