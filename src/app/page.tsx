import { FamilyTreeEditor } from "@/components/family-tree-editor";

export default function Home() {
  return (
    <main className="h-screen w-full flex flex-col overflow-hidden bg-background">
      <FamilyTreeEditor />
    </main>
  );
}
