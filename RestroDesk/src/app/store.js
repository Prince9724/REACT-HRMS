import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setUser } from '../features/auth/authSlice';
import menuReducer from '../features/menu/menuSlice';
import orderReducer from '../features/orders/orderSlice';
import employeeReducer from '../features/employees/employeeSlice';
import reportReducer from '../features/reports/reportSlice';
import tablesReducer from '../features/tables/tablesSlice';
import leaveReducer from '../features/leave/leaveSlice';

// Load state from localStorage
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

// Save state to localStorage
const saveState = (state) => {
  try {
    // Only save necessary slices (exclude error states)
    const stateToSave = {
      auth: { user: state.auth.user, isLoading: false, error: null },
      menu: { items: state.menu.items, isLoading: false, error: null },
      orders: { allOrders: state.orders.allOrders, myOrders: state.orders.myOrders, isLoading: false, error: null },
      employees: { list: state.employees.list, isLoading: false, error: null },
      reports: state.reports,
      tables: { list: state.tables.list, isLoading: false, error: null },
      leave: state.leave,
    };
    const serializedState = JSON.stringify(stateToSave);
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

// ✅ IMPORTANT: Manually dispatch user after store creation
const initializeAuth = () => {
  const state = store.getState();
  if (state.auth?.user) {
    // User already in store, do nothing
    console.log('User already loaded:', state.auth.user);
  } else {
    // Try to load from persisted state
    if (persistedState?.auth?.user) {
      store.dispatch(setUser(persistedState.auth.user));
      console.log('User loaded from persistence:', persistedState.auth.user);
    }
  }
};

initializeAuth();

// Subscribe to save state on changes
store.subscribe(() => {
  saveState(store.getState());
});