"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import type { User } from "@/lib/supabase";

export type UserFormValues = {
  nama: string;
  email: string;
  password: string;
};

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: User | null;
  onSubmit: (values: UserFormValues) => Promise<void>;
}

const EMPTY_FORM: UserFormValues = { nama: "", email: "", password: "" };

export function UserFormDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: UserFormDialogProps) {
  const [values, setValues] = React.useState<UserFormValues>(EMPTY_FORM);
  const [errors, setErrors] = React.useState<Partial<UserFormValues>>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setValues(
        initialData
          ? {
              nama: initialData.nama,
              email: initialData.email,
              password: initialData.password,
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, initialData]);

  function updateField(field: keyof UserFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const nextErrors: Partial<UserFormValues> = {};
    if (!values.nama.trim()) nextErrors.nama = "Nama wajib diisi";
    if (!values.email.trim()) {
      nextErrors.email = "Email wajib diisi";
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      nextErrors.email = "Format email tidak valid";
    }
    if (!values.password.trim()) nextErrors.password = "Password wajib diisi";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Tambah User" : "Edit User"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Isi data user baru di bawah ini."
                : "Perbarui data user di bawah ini."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <TextField
              label="Nama"
              placeholder="Masukkan nama"
              value={values.nama}
              onChange={(e) => updateField("nama", e.target.value)}
              error={errors.nama}
              disabled={submitting}
              clearable
              onClear={() => updateField("nama", "")}
            />
            <TextField
              label="Email"
              placeholder="Masukkan email"
              type="email"
              value={values.email}
              onChange={(e) => updateField("email", e.target.value)}
              error={errors.email}
              disabled={submitting}
              clearable
              onClear={() => updateField("email", "")}
            />
            <TextField
              label="Password"
              placeholder="Masukkan password"
              type="password"
              value={values.password}
              onChange={(e) => updateField("password", e.target.value)}
              error={errors.password}
              disabled={submitting}
              helperText="Minimal 6 karakter"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Menyimpan..."
                : mode === "create"
                ? "Tambah"
                : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
