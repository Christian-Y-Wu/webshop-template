import type { Metadata } from 'next';
import { Download, RotateCcw, Truck } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';
import { AccountShell } from '@/components/account/account-shell';
import { MediaImage } from '@/components/ui/media-image';

export const metadata: Metadata = buildMetadata({ title: 'Orders', path: '/account/orders', noIndex: true });

const orders = [
  {
    id: 'AUR-10428',
    date: 'Jun 24, 2026',
    status: 'In transit',
    tone: 'bg-highlight/25 text-ink',
    total: '$394.00',
    items: [
      { title: 'Aria Merino Sweater', meta: 'Oat · M', seed: 'aria-1' },
      { title: 'Orbit Leather Tote', meta: 'Tan', seed: 'orbit-1' },
      { title: 'Lumen Soy Candle', meta: 'Cedar & Amber', seed: 'lumen-1' },
    ],
  },
  {
    id: 'AUR-10390',
    date: 'Jun 02, 2026',
    status: 'Delivered',
    tone: 'bg-success/12 text-success',
    total: '$148.00',
    items: [{ title: 'Solstice Slip Dress', meta: 'Champagne · S', seed: 'solstice-1' }],
  },
  {
    id: 'AUR-10233',
    date: 'May 11, 2026',
    status: 'Delivered',
    tone: 'bg-success/12 text-success',
    total: '$86.00',
    items: [{ title: 'Terra Stoneware Vase', meta: 'Sand', seed: 'terra-1' }],
  },
];

export default function OrdersPage() {
  return (
    <AccountShell title="Order history" description="Track, return or reorder your past purchases.">
      <div className="space-y-5">
        {orders.map((order) => (
          <div key={order.id} className="overflow-hidden rounded-card border border-line bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-muted/50 px-5 py-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                <span>
                  <span className="text-ink-muted">Order </span>
                  <span className="font-medium text-ink">#{order.id}</span>
                </span>
                <span className="text-ink-muted">{order.date}</span>
                <span className="font-medium text-ink">{order.total}</span>
              </div>
              <span className={`badge ${order.tone}`}>{order.status}</span>
            </div>

            <div className="divide-y divide-line px-5">
              {order.items.map((item) => (
                <div key={item.title} className="flex items-center gap-4 py-4">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg">
                    <MediaImage seed={item.seed} alt={item.title} monogram={false} sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{item.title}</p>
                    <p className="text-xs text-ink-muted">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 border-t border-line px-5 py-4">
              {order.status === 'In transit' && (
                <button className="btn-outline gap-2 px-4 py-2 text-sm">
                  <Truck size={15} /> Track order
                </button>
              )}
              <button className="btn-outline gap-2 px-4 py-2 text-sm">
                <RotateCcw size={15} /> {order.status === 'Delivered' ? 'Return or exchange' : 'Reorder'}
              </button>
              <button className="btn-ghost gap-2 px-4 py-2 text-sm">
                <Download size={15} /> Invoice
              </button>
            </div>
          </div>
        ))}
      </div>
    </AccountShell>
  );
}
