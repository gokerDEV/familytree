"use client";

import { Lock } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type {
  FamilyTreeConnectorShape,
  FamilyTreeLineStyle,
  FamilyTreeVisualConfig,
} from "@/lib/familytree";

interface FamilyTreeHowToSheetProps {
  visualConfig: FamilyTreeVisualConfig;
  setVisualConfig: React.Dispatch<React.SetStateAction<FamilyTreeVisualConfig>>;
  onResetConfig: () => void;
}

export function FamilyTreeHowToSheet({
  visualConfig,
  setVisualConfig,
  onResetConfig,
}: FamilyTreeHowToSheetProps) {
  const updateRelation = <K extends keyof FamilyTreeVisualConfig["relations"]>(
    key: K,
    updates: Partial<FamilyTreeVisualConfig["relations"][K]>,
  ) => {
    setVisualConfig((prev) => ({
      ...prev,
      relations: {
        ...prev.relations,
        [key]: { ...prev.relations[key], ...updates },
      },
    }));
  };

  const updateStatus = <K extends keyof FamilyTreeVisualConfig["statuses"]>(
    key: K,
    updates: Partial<FamilyTreeVisualConfig["statuses"][K]>,
  ) => {
    setVisualConfig((prev) => ({
      ...prev,
      statuses: {
        ...prev.statuses,
        [key]: { ...prev.statuses[key], ...updates },
      },
    }));
  };

  const updateDeceased = (desaturate: number) => {
    setVisualConfig((prev) => ({
      ...prev,
      deceased: { ...prev.deceased, desaturate },
    }));
  };

  const updateConnectorShape = (shape: FamilyTreeConnectorShape) => {
    setVisualConfig((prev) => ({
      ...prev,
      connectors: { ...prev.connectors, shape },
    }));
  };

  return (
    <Sheet>
      <SheetTrigger
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        How to
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[85vw] data-[side=left]:max-w-full! data-[side=left]:w-xl flex flex-col gap-0 p-0"
      >
        <SheetHeader className="p-6 pb-2 text-left">
          <SheetTitle>Documentation & Config</SheetTitle>
          <SheetDescription className="sr-only">
            How to use and customize.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 min-h-0 p-6 pt-4">
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Notation Guide</h3>
              <div className="text-sm font-mono bg-muted p-3 rounded-md text-muted-foreground whitespace-pre">
                {`+      marriage / spouse
x+     divorced / former spouse
a+     adopted child relation
~      step / external relation
@id    explicit person id / same person reference
"..."  nickname
(...)  birth / death date
{...}  plain text info
[...]  status / inheritance / succession tag`}
              </div>
            </div>

            <Separator />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Visual Configuration</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onResetConfig}
                  className="h-8"
                >
                  Reset config
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Relationships
                </h4>
                <div className="grid gap-4">
                  {(
                    Object.keys(visualConfig.relations) as Array<
                      keyof typeof visualConfig.relations
                    >
                  ).map((key) => {
                    const rule = visualConfig.relations[key];
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-4"
                      >
                        <Label className="text-sm w-36 truncate">
                          {rule.label}
                        </Label>
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <input
                            type="color"
                            value={rule.color}
                            onChange={(e) =>
                              updateRelation(key, { color: e.target.value })
                            }
                            className="h-8 w-8 rounded cursor-pointer p-0 border-0"
                          />
                          <Select
                            value={rule.lineStyle}
                            onValueChange={(val) => {
                              if (val) {
                                updateRelation(key, {
                                  lineStyle: val as FamilyTreeLineStyle,
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="w-24 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="solid">Solid</SelectItem>
                              <SelectItem value="dashed">Dashed</SelectItem>
                              <SelectItem value="dotted">Dotted</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex items-center gap-1.5 w-16 justify-end text-muted-foreground">
                            <Lock className="w-3.5 h-3.5" />
                            <span className="text-xs">Locked</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tree connectors
                </h4>
                <div className="flex items-center justify-between gap-4">
                  <Label className="text-sm w-36 truncate">Shape</Label>
                  <Select
                    value={visualConfig.connectors.shape}
                    onValueChange={(val) => {
                      if (val)
                        updateConnectorShape(val as FamilyTreeConnectorShape);
                    }}
                  >
                    <SelectTrigger className="w-40 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="curved">Curved</SelectItem>
                      <SelectItem value="elbow">Elbow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Statuses
                </h4>
                <div className="grid gap-4">
                  {(
                    Object.keys(visualConfig.statuses) as Array<
                      keyof typeof visualConfig.statuses
                    >
                  ).map((key) => {
                    const rule = visualConfig.statuses[key];
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-4"
                      >
                        <Label className="text-sm w-36 truncate">
                          {rule.label}
                        </Label>
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <input
                            type="color"
                            value={rule.color}
                            onChange={(e) =>
                              updateStatus(key, { color: e.target.value })
                            }
                            className="h-8 w-8 rounded cursor-pointer p-0 border-0"
                          />
                          <div className="w-24 h-8" />
                          <div className="flex items-center gap-2 w-16 justify-end">
                            <Switch
                              checked={rule.visible}
                              onCheckedChange={(val) =>
                                updateStatus(key, { visible: val })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pb-8">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Deceased Desaturation
                </h4>
                <div className="flex items-center gap-4">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[visualConfig.deceased.desaturate]}
                    onValueChange={(vals) => {
                      const v = Array.isArray(vals) ? vals[0] : vals;
                      if (typeof v === "number") updateDeceased(v);
                    }}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono text-muted-foreground w-8 text-right">
                    {visualConfig.deceased.desaturate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
