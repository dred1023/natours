/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    console.log('login sever', email, password);
    const res = await axios.post('http://127.0.0.1:3000/api/v1/users/login', {
      email,
      password,
      withCreadentials: true,
    });
    console.log('ready', email, password);
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get('http://127.0.1:3000/api/v1/users/logout');
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  } catch (e) {
    console.log(e);
    showAlert('error', 'Eoor logging out!Please try again');
  }
};
