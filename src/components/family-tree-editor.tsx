"use client";

import { markdown } from "@codemirror/lang-markdown";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  DEFAULT_FAMILY_TREE_EXAMPLE,
  DEFAULT_FAMILY_TREE_THEME,
} from "@/lib/familytree";
import { FamilyTreeHeader } from "./family-tree-header";
import { FamilyTreePreview } from "./family-tree-preview";

const FAMILY_TREE_THEME_STORAGE_KEY = "familytree.theme.v1";

export type FamilyTreeThemeConfig = {
  bloodline: string;
  spouse: string;
  formerSpouse: string;
  adopted: string;
  step: string;
  heir: string;
  inheritance: string;
  excluded: string;
};

const DEFAULT_THEME_CONFIG: FamilyTreeThemeConfig = {
  bloodline: DEFAULT_FAMILY_TREE_THEME.bloodline,
  spouse: DEFAULT_FAMILY_TREE_THEME.spouse,
  formerSpouse: DEFAULT_FAMILY_TREE_THEME.formerSpouse,
  adopted: DEFAULT_FAMILY_TREE_THEME.adopted,
  step: DEFAULT_FAMILY_TREE_THEME.step,
  heir: DEFAULT_FAMILY_TREE_THEME.heir,
  inheritance: DEFAULT_FAMILY_TREE_THEME.inheritance,
  excluded: DEFAULT_FAMILY_TREE_THEME.excluded,
};

export function FamilyTreeEditor() {
  const [source, setSource] = useState(DEFAULT_FAMILY_TREE_EXAMPLE);
  const [theme, setTheme] =
    useState<FamilyTreeThemeConfig>(DEFAULT_THEME_CONFIG);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(FAMILY_TREE_THEME_STORAGE_KEY);
    if (stored) {
      try {
        setTheme(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored theme", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(
        FAMILY_TREE_THEME_STORAGE_KEY,
        JSON.stringify(theme),
      );
    }
  }, [theme, isMounted]);

  const handleResetTheme = () => {
    setTheme(DEFAULT_THEME_CONFIG);
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden w-full">
      <FamilyTreeHeader
        theme={theme}
        setTheme={setTheme}
        onResetTheme={handleResetTheme}
      />

      <div className="flex-1 overflow-hidden w-full">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel
            defaultSize={42}
            minSize={25}
            className="flex flex-col border-r bg-background"
          >
            <div className="flex-1 overflow-auto h-full relative">
              <CodeMirror
                value={source}
                height="100%"
                extensions={[markdown()]}
                onChange={setSource}
                className="absolute inset-0"
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            defaultSize={58}
            minSize={35}
            className="flex flex-col bg-background relative"
          >
            <FamilyTreePreview source={source} theme={theme} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
