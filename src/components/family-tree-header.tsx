"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog } from "@base-ui/react/dialog";
import { useState } from "react";
import type { FamilyTreeVisualConfig } from "@/lib/familytree";
import { FamilyTreeHowToSheet } from "./family-tree-how-to-sheet";

interface FamilyTreeHeaderProps {
  visualConfig: FamilyTreeVisualConfig;
  setVisualConfig: React.Dispatch<React.SetStateAction<FamilyTreeVisualConfig>>;
  onResetConfig: () => void;
  activeSample: string;
  onSelectSample: (content: string) => void;
  isDirty: boolean;
}

export function FamilyTreeHeader({
  visualConfig,
  setVisualConfig,
  onResetConfig,
  activeSample,
  onSelectSample,
  isDirty,
}: FamilyTreeHeaderProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSample, setPendingSample] = useState<string | null>(null);

  const handleSampleChange = (val: string | null) => {
    if (!val || val === activeSample) return;
    
    if (isDirty) {
      setPendingSample(val);
      setConfirmOpen(true);
    } else {
      onSelectSample(val);
    }
  };

  const confirmSampleChange = () => {
    if (pendingSample) {
      onSelectSample(pendingSample);
    }
    setConfirmOpen(false);
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-4">
        <span className="font-semibold text-foreground">family tree</span>
        <Select value={activeSample} onValueChange={handleSampleChange}>
          <SelectTrigger className="w-[180px] h-8 text-xs">
            <SelectValue placeholder="Load a sample..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Custom</SelectItem>
            <SelectItem value="ottoman">Ottoman Dynasty</SelectItem>
            <SelectItem value="tudors">Tudors</SelectItem>
            <SelectItem value="romanov">Romanovs</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <FamilyTreeHowToSheet
          visualConfig={visualConfig}
          setVisualConfig={setVisualConfig}
          onResetConfig={onResetConfig}
        />
        <a
          href="https://github.com/gokerm/familytree"
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          GitHub
        </a>
      </div>

      <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/80 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg sm:rounded-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-ending-style:scale-95 data-starting-style:opacity-0 data-starting-style:scale-95">
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <Dialog.Title className="text-lg font-semibold font-heading text-foreground">Change Example?</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                Changing the example will reset the editor. Any modifications you made to this sample will be lost. Do you want to continue?
              </Dialog.Description>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
              <Dialog.Close className="mt-2 sm:mt-0 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                Cancel
              </Dialog.Close>
              <button
                type="button"
                onClick={confirmSampleChange}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                Continue
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
