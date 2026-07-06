"use client";

import { AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { parseAndRenderFamilyTreeSvg } from "@/lib/familytree";
import type { FamilyTreeThemeConfig } from "./family-tree-editor";

interface FamilyTreePreviewProps {
  source: string;
  theme: FamilyTreeThemeConfig;
}

export function FamilyTreePreview({ source, theme }: FamilyTreePreviewProps) {
  const { result, svg } = useMemo(() => {
    return parseAndRenderFamilyTreeSvg(source, {
      theme: {
        bloodline: theme.bloodline,
        spouse: theme.spouse,
        formerSpouse: theme.formerSpouse,
        adopted: theme.adopted,
        step: theme.step,
        heir: theme.heir,
        inheritance: theme.inheritance,
        excluded: theme.excluded,
      },
      showLegend: true,
    });
  }, [source, theme]);

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {!result.ok && result.issues.length > 0 && (
        <div className="absolute top-0 left-0 right-0 z-10 p-3 bg-destructive/10 border-b border-destructive/20 text-destructive text-sm flex flex-col gap-1">
          {result.issues.map((issue) => (
            <div
              key={`${issue.line}-${issue.code}`}
              className="flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                Line {issue.line}: {issue.code} — {issue.message}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="flex-1 overflow-auto bg-background p-4 flex items-start justify-start">
        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml: The SVG output is trusted
          dangerouslySetInnerHTML={{ __html: svg }}
          className="min-w-fit min-h-fit"
        />
      </div>
    </div>
  );
}
