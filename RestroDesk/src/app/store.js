import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import menuReducer from '../features/menu/menuSlice';
import orderReducer from '../features/orders/orderSlice';
import employeeReducer from '../features/employees/employeeSlice';
import reportReducer from '../features/reports/reportSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    orders: orderReducer,
    employees: employeeReducer,
    reports: reportReducer,
  },
});