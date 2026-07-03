import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setUser } from '../features/auth/authSlice';
import menuReducer from '../features/menu/menuSlice';
import orderReducer from '../features/orders/orderSlice';
import employeeReducer from '../features/employees/employeeSlice';
import reportReducer from '../features/reports/reportSlice';
import tablesReducer from '../features/tables/tablesSlice';
import leaveReducer from '../features/leave/leaveSlice';

// ✅ Safe localStorage load
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) return undefined;
    const parsed = JSON.parse(serializedState);
    console.log('📂 State loaded from localStorage');
    return parsed;
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

// ✅ Safe localStorage save
const saveState = (state) => {
  try {
    const stateToSave = {
      auth: { user: state.auth.user, isLoading: false, error: null },
      menu: { items: state.menu.items, isLoading: false, error: null },
      orders: { allOrders: state.orders.allOrders, myOrders: state.orders.myOrders, isLoading: false, error: null },
      employees: { list: state.employees.list, isLoading: false, error: null },
      reports: state.reports,
      tables: { list: state.tables.list, isLoading: false, error: null },
      leave: state.leave,
    };
    localStorage.setItem('reduxState', JSON.stringify(stateToSave));
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

// ✅ Force rehydrate user from localStorage on app load
const initializeAuth = () => {
  const state = store.getState();
  if (state.auth?.user) {
    console.log('👤 User already loaded:', state.auth.user.name);
  } else if (persistedState?.auth?.user) {
    store.dispatch(setUser(persistedState.auth.user));
    console.log('👤 User loaded from persistence:', persistedState.auth.user.name);
  } else {
    console.log('👤 No user found');
  }
};

initializeAuth();

// ✅ Save state on every change
store.subscribe(() => {
  saveState(store.getState());
});

console.log('🚀 Store initialized');