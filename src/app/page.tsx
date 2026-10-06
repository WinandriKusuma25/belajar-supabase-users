import { UsersTable } from "@/components/users-table";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-12 dark:bg-black">
      <main className="w-full max-w-4xl">
        <UsersTable />
      </main>
    </div>
  );
}
