"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import type { FamilyTreeThemeConfig } from "./family-tree-editor";
import { FamilyTreeHowToSheet } from "./family-tree-how-to-sheet";

interface FamilyTreeHeaderProps {
  theme: FamilyTreeThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<FamilyTreeThemeConfig>>;
  onResetTheme: () => void;
}

export function FamilyTreeHeader({
  theme,
  setTheme,
  onResetTheme,
}: FamilyTreeHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">family tree</span>
      </div>
      <div className="flex items-center gap-2">
        <FamilyTreeHowToSheet
          theme={theme}
          setTheme={setTheme}
          onResetTheme={onResetTheme}
        />
        <a href="https://github.com/gokerm/familytree" target="_blank" rel="noreferrer" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          GitHub
        </a>
      </div>
    </header>
  );
}
