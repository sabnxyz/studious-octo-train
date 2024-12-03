import { PropsWithChildren } from "react";
import { AddNewTaskDialog } from "./(index)/_components/AddNewTaskDialog";
import { UserProfile } from "./_components/UserProfile";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="h-20 p-4">
        <p className="text-xl font-semibold">Task Manager DND 👻</p>
        <p className="flex gap-1 text-gray-600">
          A task manager app created with
          <code className="px-2 py-0.5 text-sm bg-gray-100 border border-gray-200 rounded-md">
            @dnd-kit
          </code>
          &
          <code className="px-2 py-0.5 text-sm bg-gray-100 border border-gray-200 rounded-md">
            trpc
          </code>
        </p>
      </header>
      <div className="grid grid-cols-[repeat(20,_minmax(0,1fr))]">
        <aside className="p-4 pt-2 col-span-3 flex flex-col justify-between">
          <div className="w-full">
            <div>
              <p className="font-semibold text-sm text-gray-500">
                Your Workspace
              </p>
            </div>
            <div className="mt-2">
              <AddNewTaskDialog />
            </div>
          </div>
          <div className="p-2 py-3 rounded-xl border border-gray-100">
            <UserProfile />
          </div>
        </aside>
        <main className="h-[calc(100dvh_-_5rem)] pr-4 pb-4 col-[17_/_span_17] col-start-4">
          {children}
        </main>
      </div>
    </div>
  );
}
