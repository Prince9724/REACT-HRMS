import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import menuReducer from '../features/menu/menuSlice';
import orderReducer from '../features/orders/orderSlice';
import employeeReducer from '../features/employees/employeeSlice';
import reportReducer from '../features/reports/reportSlice';
import tablesReducer from '../features/tables/tablesSlice';
import leaveReducer from '../features/leave/leaveSlice';

// ✅ Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

// ✅ Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    orders: orderReducer,
    employees: employeeReducer,
    reports: reportReducer,
    tables: tablesReducer,
    leave: leaveReducer,
  },
  preloadedState: persistedState,
});

// ✅ Subscribe to store changes (save on every state change)
store.subscribe(() => {
  saveState(store.getState());
});