"use client";

import { useState } from "react";
import { toast } from "sonner";

import { changeOwnPassword } from "@/app/admins/(shell)/admins/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AccountForm() {
  const [pending, setPending] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("تکرار رمز جدید یکسان نیست.");
      return;
    }
    setPending(true);
    const result = await changeOwnPassword(currentPassword, newPassword);
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("رمز عبور تغییر کرد");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>تغییر رمز عبور</CardTitle>
        </CardHeader>
        <CardContent className="max-w-md space-y-5">
          <div>
            <Label htmlFor="current-password">رمز فعلی</Label>
            <Input id="current-password" dir="ltr" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="new-password">رمز جدید</Label>
            <Input id="new-password" dir="ltr" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="حداقل ۸ کاراکتر" />
          </div>
          <div>
            <Label htmlFor="confirm-password">تکرار رمز جدید</Label>
            <Input id="confirm-password" dir="ltr" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={pending}>تغییر رمز عبور</Button>
        </CardContent>
      </Card>
    </form>
  );
}
