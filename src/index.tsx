import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { USER_LOCAL_STORAGE_KEY } from './constants';
import { uuid } from 'uuidv4';
import { generateName } from './utils/nameGenerator/nameGenerator';
import { User } from './types';
import { createUser } from './api';

let user: User;
const storedUser = window.localStorage.getItem(USER_LOCAL_STORAGE_KEY);
if (storedUser) {
  user = JSON.parse(storedUser);
} else {
  user = {
    username: generateName(),
    id: uuid(),
  };
  createUser(user);
  window.localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App user={user}/>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
