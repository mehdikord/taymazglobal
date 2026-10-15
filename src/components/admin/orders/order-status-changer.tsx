"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { updateOrderStatus, updateTrackingCode } from "@/app/admins/(shell)/orders/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ORDER_STATUS_LABELS } from "@/lib/admin/helpers";
import type { OrderStatus } from "@/lib/repositories/orders.admin";

const ORDER_FLOW: OrderStatus[] = ["pending_approval", "preparing", "in_transit", "completed"];

type OrderStatusChangerProps = {
  orderId: string;
  currentStatus: OrderStatus;
  currentTrackingCode: string | null;
};

export function OrderStatusChanger({
  orderId,
  currentStatus,
  currentTrackingCode,
}: OrderStatusChangerProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<OrderStatus | null>(null);
  const [note, setNote] = useState("");
  const [trackingCode, setTrackingCode] = useState(currentTrackingCode ?? "");

  async function handleChange(status: OrderStatus) {
    setBusy(status);
    const result = await updateOrderStatus(orderId, status, note);
    setBusy(null);
    if (result.ok) {
      toast.success(`وضعیت به «${ORDER_STATUS_LABELS[status]}» تغییر کرد`);
      setNote("");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleTracking() {
    const result = await updateTrackingCode(orderId, trackingCode);
    if (result.ok) {
      toast.success("کد رهگیری ذخیره شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {ORDER_FLOW.map((status) => {
          const active = status === currentStatus;
          const done = currentStatus !== "cancelled" && ORDER_FLOW.indexOf(status) < ORDER_FLOW.indexOf(currentStatus);
          return (
            <Button
              key={status}
              variant={active ? "primary" : done ? "secondary" : "outline"}
              size="sm"
              disabled={busy !== null}
              onClick={() => handleChange(status)}
            >
              {ORDER_STATUS_LABELS[status]}
            </Button>
          );
        })}
        <Button
          variant={currentStatus === "cancelled" ? "primary" : "outline"}
          size="sm"
          disabled={busy !== null}
          className={currentStatus === "cancelled" ? "bg-red-600 hover:bg-red-700" : "text-red-600"}
          onClick={() => handleChange("cancelled")}
        >
          لغو سفارش
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="status-note">یادداشت تغییر وضعیت (اختیاری)</Label>
        <Textarea
          id="status-note"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="مثلاً: مرسوله تحویل شرکت حمل شد."
        />
      </div>

      <div className="flex items-end gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="tracking">کد رهگیری</Label>
          <Input id="tracking" dir="ltr" value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} placeholder="TRK-000000000000" maxLength={16} />
        </div>
        <Button type="button" variant="outline" onClick={handleTracking} disabled={busy !== null}>
          ذخیره کد
        </Button>
      </div>
    </div>
  );
}
