"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { FamilyTreeThemeConfig } from "./family-tree-editor";

interface FamilyTreeHowToSheetProps {
  theme: FamilyTreeThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<FamilyTreeThemeConfig>>;
  onResetTheme: () => void;
}

export function FamilyTreeHowToSheet({
  theme,
  setTheme,
  onResetTheme,
}: FamilyTreeHowToSheetProps) {
  const handleColorChange = (
    key: keyof FamilyTreeThemeConfig,
    value: string,
  ) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: "outline", size: "sm" })}>
        How to
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[400px] sm:w-[540px] flex flex-col gap-0 p-0"
      >
        <SheetHeader className="p-6 pb-2 text-left">
          <SheetTitle>Documentation & Theme</SheetTitle>
          <SheetDescription className="sr-only">
            How to use and customize.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 p-6 pt-4">
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Notation Guide</h3>
              <div className="text-sm font-mono bg-muted p-3 rounded-md text-muted-foreground whitespace-pre">
                {`+     evlilik / eş
x+    boşanmış eski eş
a+    evlatlık bağı
~     üvey / soy dışı bağlantı
@id   aynı kişiyi tekrar bağlama
"..." nickname
(...) doğum / ölüm
{...} info
[...] statü / miras / varis`}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Theme Colors</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetTheme}
                  className="h-8"
                >
                  Reset colors
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(theme).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <Label htmlFor={key} className="text-xs capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        id={key}
                        type="color"
                        value={value}
                        onChange={(e) =>
                          handleColorChange(
                            key as keyof FamilyTreeThemeConfig,
                            e.target.value,
                          )
                        }
                        className="h-8 w-12 rounded cursor-pointer p-0 border-0"
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
