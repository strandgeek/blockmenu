import React, { createContext, FC, useState } from 'react';
import { MenuItem } from '../lib/metadata';

export interface OrderProviderProps {
    children: React.ReactNode;
}

export interface OrderItem {
  item: MenuItem;
  quantity: number;
}

export interface OrderContext {
  items: OrderItem[];
  setOrderItem: (orderItem: OrderItem) => void;
  clear: () => void;
}

export const orderContext = createContext<OrderContext>({
  items: [],
  setOrderItem: () => null,
  clear: () => null,
});


export const OrderProvider: FC<OrderProviderProps> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const setOrderItem = (orderItem: OrderItem) => {
    const existingOrderIdx = items.findIndex((i) => i.item.id === orderItem.item.id);
    if (existingOrderIdx >= 0) {
      const newItems = [...items];
      newItems[existingOrderIdx] = orderItem;
      setItems(newItems);
    } else {
      setItems([...items, orderItem]);
    }
  }
  const clear = () => setItems([]);
  return (
    <orderContext.Provider value={{ items, setOrderItem, clear }}>
      {children}
    </orderContext.Provider>
  )
}
