// pages/MenuManagement.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '../features/menu/menuSlice';

function MenuManagement() {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.menu);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name} - ₹{item.price}</div>)}
    </div>
  );
}