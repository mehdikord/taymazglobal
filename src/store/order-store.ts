"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CommerceOrder } from "@/types";

type OrderStore = {
  orders: CommerceOrder[];
  addOrder: (order: CommerceOrder) => void;
  getOrderByNumber: (orderNumber: string) => CommerceOrder | undefined;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      getOrderByNumber: (orderNumber) => get().orders.find((order) => order.orderNumber === orderNumber),
    }),
    { name: "taymaz-orders" },
  ),
);
