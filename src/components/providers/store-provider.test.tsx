import { beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { StoreProvider, useStore } from '@/components/providers/store-provider';
import { products } from '@/lib/data/products';

function wrapper({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}

describe('StoreProvider cart math', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a line and computes the subtotal from it', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    const product = products[0];

    act(() => {
      result.current.addLine({ product, quantity: 1 });
    });

    expect(result.current.cartCount).toBe(1);
    expect(result.current.subtotal).toBe(product.price);
  });

  it('merges a repeat add into the existing line instead of duplicating it', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    const product = products[0];

    act(() => {
      result.current.addLine({ product, quantity: 1 });
      result.current.addLine({ product, quantity: 2 });
    });

    expect(result.current.lines).toHaveLength(1);
    expect(result.current.cartCount).toBe(3);
    expect(result.current.subtotal).toBe(product.price * 3);
  });

  it('removes the line once its quantity is updated down to zero', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    const product = products[1];

    act(() => {
      result.current.addLine({ product, quantity: 1 });
    });
    const lineId = result.current.lines[0].id;

    act(() => {
      result.current.updateQuantity(lineId, 0);
    });

    expect(result.current.lines).toHaveLength(0);
    expect(result.current.subtotal).toBe(0);
  });
});
