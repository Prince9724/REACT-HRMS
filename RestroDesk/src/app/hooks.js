import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';

// ✅ Ye exports missing the — add karo
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// ✅ Polling hook already hai
export const usePolling = (callback, interval = 5000) => {
  const savedCallback = useRef();
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    savedCallback.current();
    const id = setInterval(() => savedCallback.current(), interval);
    return () => clearInterval(id);
  }, [interval]);
};