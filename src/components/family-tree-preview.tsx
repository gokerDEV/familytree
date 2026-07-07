"use client";

import { AlertCircle } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  type FamilyTreeVisualConfig,
  parseAndRenderFamilyTreeSvg,
} from "@/lib/familytree";

interface FamilyTreePreviewProps {
  source: string;
  visualConfig: FamilyTreeVisualConfig;
  templateSvg?: string | null;
}

export function FamilyTreePreview({
  source,
  visualConfig,
  templateSvg,
}: FamilyTreePreviewProps) {
  const { result, svg } = useMemo(() => {
    return parseAndRenderFamilyTreeSvg(source, {
      visualConfig,
      showLegend: true,
      cardTemplateSvg: templateSvg,
    });
  }, [source, visualConfig, templateSvg]);

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    // Zoom in/out
    const zoomFactor = 0.001; // Scale factor for mouse wheel
    const delta = -e.deltaY * zoomFactor;
    setScale((prev) => Math.min(Math.max(0.25, prev * (1 + delta)), 3));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only accept left mouse button or touch
    if (e.button !== 0 && e.pointerType === "mouse") return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan((prev) => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const fitToWindow = () => {
    if (!containerRef.current) return;
    const svgElement = containerRef.current.querySelector("svg");
    if (!svgElement) return;

    const viewBox = svgElement.viewBox.baseVal;
    if (!viewBox || viewBox.width === 0) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    // Calculate required scale with 5% padding
    const newScale =
      Math.min(
        containerRect.width / viewBox.width,
        containerRect.height / viewBox.height,
      ) * 0.95;

    const clampedScale = Math.min(Math.max(0.25, newScale), 3);
    setScale(clampedScale);

    // Center the content
    setPan({
      x: (containerRect.width - viewBox.width * clampedScale) / 2,
      y: (containerRect.height - viewBox.height * clampedScale) / 2,
    });
  };

  const downloadSvg = () => {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "family-tree.svg";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {!result.ok && result.issues.length > 0 && (
        <div className="absolute top-0 left-0 right-0 z-20 p-3 bg-destructive/10 border-b border-destructive/20 text-destructive text-sm flex flex-col gap-1">
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

      <ContextMenu>
        <ContextMenuTrigger
          ref={containerRef}
          className="flex-1 overflow-hidden bg-background relative cursor-grab active:cursor-grabbing"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transformOrigin: "0 0",
            }}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: The SVG output is trusted
            dangerouslySetInnerHTML={{ __html: svg }}
            className="absolute inset-0"
          />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={fitToWindow}>
            Fit the window
          </ContextMenuItem>
          <ContextMenuItem onClick={downloadSvg}>Download SVG</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
