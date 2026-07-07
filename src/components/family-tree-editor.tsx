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
  type FamilyTreeVisualConfig,
  mergeFamilyTreeVisualConfig,
} from "@/lib/familytree";
import { FamilyTreeHeader } from "./family-tree-header";
import { FamilyTreePreview } from "./family-tree-preview";

const FAMILY_TREE_VISUAL_CONFIG_STORAGE_KEY = "familytree.visual-config.v1";

export function FamilyTreeEditor() {
  const [source, setSource] = useState(DEFAULT_FAMILY_TREE_EXAMPLE);
  const [originalSource, setOriginalSource] = useState(
    DEFAULT_FAMILY_TREE_EXAMPLE,
  );
  const [activeSample, setActiveSample] = useState("custom");
  const [visualConfig, setVisualConfig] = useState<FamilyTreeVisualConfig>(() =>
    mergeFamilyTreeVisualConfig(),
  );
  const [templateSvg, setTemplateSvg] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const isDirty = activeSample !== "custom" && source !== originalSource;

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(FAMILY_TREE_VISUAL_CONFIG_STORAGE_KEY);
    if (stored) {
      try {
        setVisualConfig(mergeFamilyTreeVisualConfig(JSON.parse(stored)));
      } catch (e) {
        console.error("Failed to parse stored visual config", e);
      }
    }

    const storedSample =
      localStorage.getItem("familytree.activeSample") || "custom";
    setActiveSample(storedSample);

    const storedSource =
      localStorage.getItem("familytree.source") ||
      localStorage.getItem("familytree.custom.source") ||
      DEFAULT_FAMILY_TREE_EXAMPLE;
    setSource(storedSource);

    if (storedSample !== "custom") {
      fetch(`/samples/${storedSample}.ftmd`)
        .then((res) => res.text())
        .then((text) => setOriginalSource(text))
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(
        FAMILY_TREE_VISUAL_CONFIG_STORAGE_KEY,
        JSON.stringify(visualConfig),
      );
    }
  }, [visualConfig, isMounted]);

  useEffect(() => {
    if (visualConfig.cardTemplateId && visualConfig.cardTemplateId !== "default") {
      fetch(`/templates/${visualConfig.cardTemplateId}.svg`)
        .then((res) => res.text())
        .then(setTemplateSvg)
        .catch(console.error);
    } else {
      setTemplateSvg(null);
    }
  }, [visualConfig.cardTemplateId]);

  const handleResetConfig = () => {
    setVisualConfig(mergeFamilyTreeVisualConfig());
  };

  const handleSourceChange = (val: string) => {
    setSource(val);
    localStorage.setItem("familytree.source", val);
    if (activeSample === "custom") {
      localStorage.setItem("familytree.custom.source", val);
    }
  };

  const handleSelectSample = async (sampleId: string) => {
    if (sampleId === "custom") {
      const customSource = localStorage.getItem("familytree.custom.source");
      setSource(customSource || DEFAULT_FAMILY_TREE_EXAMPLE);
      setActiveSample("custom");
      localStorage.setItem("familytree.activeSample", "custom");
      return;
    }

    try {
      const res = await fetch(`/samples/${sampleId}.ftmd`);
      if (res.ok) {
        const text = await res.text();
        setSource(text);
        setOriginalSource(text);
        setActiveSample(sampleId);
        localStorage.setItem("familytree.activeSample", sampleId);
        localStorage.setItem("familytree.source", text);
      }
    } catch (e) {
      console.error("Failed to load sample", e);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden w-full">
      <FamilyTreeHeader
        visualConfig={visualConfig}
        setVisualConfig={setVisualConfig}
        onResetConfig={handleResetConfig}
        activeSample={activeSample}
        onSelectSample={handleSelectSample}
        isDirty={isDirty}
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
                onChange={handleSourceChange}
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
            <FamilyTreePreview
              source={source}
              visualConfig={visualConfig}
              templateSvg={templateSvg}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
