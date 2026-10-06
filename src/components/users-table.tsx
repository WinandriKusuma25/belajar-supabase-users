"use client";

import * as React from "react";
import { MagnifyingGlass, PencilSimple, Trash, Plus } from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  UserFormDialog,
  type UserFormValues,
} from "@/components/user-form-dialog";
import { supabase, type User } from "@/lib/supabase";

export function UsersTable() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = React.useState<User | null>(null);

  const [deletingUser, setDeletingUser] = React.useState<User | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(`Gagal memuat data: ${error.message}`);
    } else {
      setUsers(data ?? []);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user.nama.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  function openCreateDialog() {
    setFormMode("create");
    setEditingUser(null);
    setFormOpen(true);
  }

  function openEditDialog(user: User) {
    setFormMode("edit");
    setEditingUser(user);
    setFormOpen(true);
  }

  async function handleFormSubmit(values: UserFormValues) {
    if (formMode === "create") {
      const { error } = await supabase.from("users").insert(values);
      if (error) {
        toast.error(`Gagal menambah user: ${error.message}`);
        throw error;
      }
      toast.success("User berhasil ditambahkan");
    } else if (editingUser) {
      const { error } = await supabase
        .from("users")
        .update(values)
        .eq("id", editingUser.id);
      if (error) {
        toast.error(`Gagal menyimpan perubahan: ${error.message}`);
        throw error;
      }
      toast.success("User berhasil diperbarui");
    }
    await loadUsers();
  }

  async function handleDelete() {
    if (!deletingUser) return;
    setDeleting(true);
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", deletingUser.id);
    setDeleting(false);

    if (error) {
      toast.error(`Gagal menghapus user: ${error.message}`);
      return;
    }
    toast.success("User berhasil dihapus");
    setDeletingUser(null);
    await loadUsers();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">
          Semua User{" "}
          <span className="text-muted-foreground font-normal">
            {users.length}
          </span>
        </h1>

        <div className="flex items-center gap-2">
          <div className="relative">
            <MagnifyingGlass
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-56 rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary"
            />
          </div>

          <Button onClick={openCreateDialog}>
            <Plus size={16} data-icon="inline-start" />
            Tambah User
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="w-24 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  {search ? "Tidak ada user yang cocok." : "Belum ada user."}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nama}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${user.nama}`}
                        onClick={() => openEditDialog(user)}
                      >
                        <PencilSimple size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Hapus ${user.nama}`}
                        onClick={() => setDeletingUser(user)}
                      >
                        <Trash size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initialData={editingUser}
        onSubmit={handleFormSubmit}
      />

      <AlertDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus user ini?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingUser
                ? `"${deletingUser.nama}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
