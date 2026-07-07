export type FamilyTreeRelationKind = "biological" | "adopted" | "step";
export type FamilyTreeUnionKind = "current" | "former";
export type FamilyTreeIssueSeverity = "error" | "warning";

export type FamilyTreeIssue = {
  line: number;
  column: number;
  severity: FamilyTreeIssueSeverity;
  code: string;
  message: string;
};

export type FamilyTreePerson = {
  id: string;
  displayName: string;
  name: string;
  surname: string;
  birthDate?: string;
  deathDate?: string;
  nickname?: string;
  info?: string;
  tags: string[];
  raw: string;
};

export type FamilyTreeUnion = {
  id: string;
  kind: FamilyTreeUnionKind;
  partnerIds: string[];
  line: number;
  anchorPersonId?: string;
};

export type FamilyTreeChildRelation = {
  id: string;
  childId: string;
  kind: FamilyTreeRelationKind;
  line: number;
  unionId?: string;
  parentId?: string;
};

export type FamilyTreePersonNode = {
  kind: "person";
  personId: string;
  line: number;
  incomingRelationKind: FamilyTreeRelationKind;
  unions: FamilyTreeUnionNode[];
};

export type FamilyTreeUnionNode = {
  kind: "union";
  unionId: string;
  line: number;
  children: FamilyTreePersonNode[];
};

export type FamilyTreeRootNode = FamilyTreePersonNode | FamilyTreeUnionNode;

export type FamilyTreeDocument = {
  title?: string;
  persons: FamilyTreePerson[];
  unions: FamilyTreeUnion[];
  childRelations: FamilyTreeChildRelation[];
  roots: FamilyTreeRootNode[];
};

export type FamilyTreeParseResult = {
  ok: boolean;
  document: FamilyTreeDocument;
  issues: FamilyTreeIssue[];
};

export type FamilyTreeParseOptions = {
  indentSize?: number;
};

export type FamilyTreeTheme = {
  background: string;
  text: string;
  mutedText: string;
  cardBackground: string;
  connector: string;
};

export type FamilyTreeLineStyle = "solid" | "dashed" | "dotted";
export type FamilyTreeConnectorShape = "curved" | "elbow";

export type FamilyTreeVisualRule = {
  label: string;
  color: string;
  lineStyle: FamilyTreeLineStyle;
  visible: boolean;
  lockedVisible?: boolean;
};

export type FamilyTreeVisualConfig = {
  relations: {
    biological: FamilyTreeVisualRule;
    spouse: FamilyTreeVisualRule;
    formerSpouse: FamilyTreeVisualRule;
    adopted: FamilyTreeVisualRule;
    step: FamilyTreeVisualRule;
  };
  statuses: {
    heir: FamilyTreeVisualRule;
    inheritance: FamilyTreeVisualRule;
    excluded: FamilyTreeVisualRule;
    renounced: FamilyTreeVisualRule;
    will: FamilyTreeVisualRule;
  };
  deceased: {
    desaturate: number;
  };
  connectors: {
    shape: FamilyTreeConnectorShape;
  };
  cardTemplateId: string;
};

export type FamilyTreeRenderOptions = FamilyTreeParseOptions & {
  theme?: Partial<FamilyTreeTheme>;
  visualConfig?: Partial<FamilyTreeVisualConfig>;
  cardWidth?: number;
  cardHeight?: number;
  levelGap?: number;
  siblingGap?: number;
  partnerGap?: number;
  padding?: number;
  showLegend?: boolean;
  title?: string;
  cardTemplateSvg?: string | null;
};

export const DEFAULT_FAMILY_TREE_THEME: FamilyTreeTheme = {
  background: "#ffffff",
  text: "#18181b",
  mutedText: "#71717a",
  cardBackground: "#ffffff",
  connector: "#94a3b8",
};

export const DEFAULT_FAMILY_TREE_VISUAL_CONFIG: FamilyTreeVisualConfig = {
  relations: {
    biological: {
      label: "Biological child",
      color: "#2563eb",
      lineStyle: "solid",
      visible: true,
      lockedVisible: true,
    },
    spouse: {
      label: "Marriage / spouse",
      color: "#7c3aed",
      lineStyle: "solid",
      visible: true,
      lockedVisible: true,
    },
    formerSpouse: {
      label: "Divorced / former spouse",
      color: "#a1a1aa",
      lineStyle: "dashed",
      visible: true,
      lockedVisible: true,
    },
    adopted: {
      label: "Adopted child",
      color: "#059669",
      lineStyle: "dashed",
      visible: true,
      lockedVisible: true,
    },
    step: {
      label: "Step / external",
      color: "#eab308",
      lineStyle: "dotted",
      visible: true,
      lockedVisible: true,
    },
  },
  statuses: {
    heir: {
      label: "Heir / successor [v]",
      color: "#dc2626",
      lineStyle: "solid",
      visible: true,
    },
    inheritance: {
      label: "Inheritance [m]",
      color: "#ca8a04",
      lineStyle: "solid",
      visible: true,
    },
    excluded: {
      label: "Excluded [x]",
      color: "#52525b",
      lineStyle: "solid",
      visible: true,
    },
    renounced: {
      label: "Renounced [red]",
      color: "#52525b",
      lineStyle: "solid",
      visible: true,
    },
    will: {
      label: "Will / testament [will]",
      color: "#16a34a",
      lineStyle: "solid",
      visible: true,
    },
  },
  deceased: {
    desaturate: 50,
  },
  connectors: {
    shape: "curved",
  },
  cardTemplateId: "default",
};

export function mergeFamilyTreeVisualConfig(
  stored?: Partial<FamilyTreeVisualConfig>,
): FamilyTreeVisualConfig {
  return {
    relations: {
      biological: {
        ...DEFAULT_FAMILY_TREE_VISUAL_CONFIG.relations.biological,
        ...stored?.relations?.biological,
      },
      spouse: {
        ...DEFAULT_FAMILY_TREE_VISUAL_CONFIG.relations.spouse,
        ...stored?.relations?.spouse,
      },
      formerSpouse: {
        ...DEFAULT_FAMILY_TREE_VISUAL_CONFIG.relations.formerSpouse,
        ...stored?.relations?.formerSpouse,
      },
      adopted: {
        ...DEFAULT_FAMILY_TREE_VISUAL_CONFIG.relations.adopted,
        ...stored?.relations?.adopted,
      },
      step: {
        ...DEFAULT_FAMILY_TREE_VISUAL_CONFIG.relations.step,
        ...stored?.relations?.step,
      },
    },
    statuses: {
      heir: {
        ...DEFAULT_FAMILY_TREE_VISUAL_CONFIG.statuses.heir,
        ...stored?.statuses?.heir,
      },
      inheritance: {
        ...DEFAULT_FAMILY_TREE_VISUAL_CONFIG.statuses.inheritance,
        ...stored?.statuses?.inheritance,
      },
      excluded: {
        ...DEFAULT_FAMILY_TREE_VISUAL_CONFIG.statuses.excluded,
        ...stored?.statuses?.excluded,
      },
      renounced: {
        ...DEFAULT_FAMILY_TREE_VISUAL_CONFIG.statuses.renounced,
        ...stored?.statuses?.renounced,
      },
      will: {
        ...DEFAULT_FAMILY_TREE_VISUAL_CONFIG.statuses.will,
        ...stored?.statuses?.will,
      },
    },
    deceased: {
      ...DEFAULT_FAMILY_TREE_VISUAL_CONFIG.deceased,
      ...stored?.deceased,
    },
    connectors: {
      ...DEFAULT_FAMILY_TREE_VISUAL_CONFIG.connectors,
      ...stored?.connectors,
    },
    cardTemplateId: stored?.cardTemplateId || DEFAULT_FAMILY_TREE_VISUAL_CONFIG.cardTemplateId,
  };
}

export const DEFAULT_FAMILY_TREE_EXAMPLE = `# Yılmaz Krallığı / Ailesi

- Ahmet Yılmaz @ahmet1945 "Kral Ahmet" (1945)
  - + Ayşe Yılmaz @ayse1948 "Kraliçe Ayşe" (1948)
    - Mehmet Yılmaz @mehmet1972 "Büyük Oğul" (1972)
      - x+ Fatma Demir @fatma1974 (1974)
        - Ali Yılmaz @ali1998 (1998)
        - Elif Yılmaz @elif2001 [v] (2001)
        - a+ Ece Yılmaz @ece2004 (2004)
      - + Sema Kaya @sema1978 (1978)
        - ~ Bora Kaya @bora2005 (2005) {Sema'nın önceki evliliğinden çocuğu}

    - Zeynep Yılmaz @zeynep1975 [v] (1975)
      - x+ Kemal Arslan @kemal1973 (1973)
        - Mert Arslan @mert1999 (1999)
        - Deniz Arslan @deniz2002 (2002)
        - a+ Ekin Arslan @ekin2006 (2006)
      - + Murat Çelik @murat1977 (1977)
        - ~ Lara Çelik @lara2008 (2008) {Murat'ın önceki evliliğinden çocuğu}

    - a+ Cem Yılmaz @cem1980 (1980)
      - x+ Derya Koç @derya1982 (1982)
        - Okan Yılmaz @okan2007 (2007)
        - Selin Yılmaz @selin2010 (2010)
        - a+ Ada Yılmaz @ada2013 (2013)
      - + Nehir Aydın @nehir1985 (1985)
        - ~ Tuna Aydın @tuna2011 (2011) {Nehir'in önceki evliliğinden çocuğu}`;

type MutableDocument = {
  title?: string;
  personsById: Map<string, FamilyTreePerson>;
  unions: FamilyTreeUnion[];
  childRelations: FamilyTreeChildRelation[];
  roots: FamilyTreeRootNode[];
};

type StackEntry = { level: number; node: FamilyTreeRootNode };

type ParsedItem = {
  kind: "person" | "spouse";
  personText: string;
  relationKind: FamilyTreeRelationKind;
  unionKind?: FamilyTreeUnionKind;
  partnerText?: string;
  column: number;
};

type PersonDraft = Omit<FamilyTreePerson, "id"> & { explicitId?: string };
type Size = { width: number; height: number };
type Point = { x: number; y: number };

type RowLayoutSpouse = {
  personId: string;
  unionId: string;
  relationType: "spouse" | "formerSpouse";
  x: number;
};

type RowLayoutUnion = {
  unionId: string;
  spousePersonId?: string;
  weddingX: number;
  weddingY: number;
  childrenIds: string[]; // for connecting lines
};

type RowLayoutNode = {
  isDummy: boolean;
  personId?: string;
  node?: FamilyTreePersonNode;
  incomingRelationKind?: FamilyTreeRelationKind;
  depth: number;
  x: number;
  y: number;
  spouses: RowLayoutSpouse[];
  unions: RowLayoutUnion[];
};

type RenderContext = {
  document: FamilyTreeDocument;
  personById: Map<string, FamilyTreePerson>;
  unionById: Map<string, FamilyTreeUnion>;
  options: Required<
    Omit<
      FamilyTreeRenderOptions,
      "theme" | "visualConfig" | "title" | "indentSize"
    >
  > & {
    title?: string;
    indentSize: number;
  };
  theme: FamilyTreeTheme;
  visualConfig: FamilyTreeVisualConfig;
  parts: string[];
};

export function parseFamilyTree(
  source: string,
  options: FamilyTreeParseOptions = {},
): FamilyTreeParseResult {
  const indentSize = options.indentSize ?? 2;
  const issues: FamilyTreeIssue[] = [];
  const document: MutableDocument = {
    personsById: new Map(),
    unions: [],
    childRelations: [],
    roots: [],
  };
  const stack: StackEntry[] = [];

  source
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .forEach((rawLine, index) => {
      const line = index + 1;
      if (!rawLine.trim()) return;

      if (/^\s*#\s+/.test(rawLine)) {
        document.title ??= rawLine.replace(/^\s*#+\s+/, "").trim();
        return;
      }

      if (rawLine.includes("\t")) {
        issues.push(
          issue(
            line,
            1,
            "error",
            "tab-indent",
            "Tab indentation is not supported. Use spaces.",
          ),
        );
        return;
      }

      const match = rawLine.match(/^(\s*)-\s+(.+)$/);
      if (!match) {
        issues.push(
          issue(
            line,
            1,
            "error",
            "invalid-line",
            "Expected a markdown list item starting with '-'.",
          ),
        );
        return;
      }

      const indent = match[1]?.length ?? 0;
      if (indent % indentSize !== 0) {
        issues.push(
          issue(
            line,
            indent + 1,
            "error",
            "invalid-indent",
            `Indentation must use ${indentSize} spaces per level.`,
          ),
        );
        return;
      }

      const level = indent / indentSize;
      if (level > stack.length) {
        issues.push(
          issue(
            line,
            indent + 1,
            "error",
            "indent-jump",
            "Indentation can only increase by one level at a time.",
          ),
        );
        return;
      }

      stack.length = level;
      const parsedItem = parseItem(
        match[2]?.trim() ?? "",
        indent + 3,
        line,
        issues,
      );
      if (!parsedItem) return;

      const parent = stack[level - 1];
      const personDraft = parsePerson(
        parsedItem.personText,
        line,
        parsedItem.column,
        issues,
      );
      if (!personDraft) return;
      const person = getOrCreatePerson(document, personDraft);

      if (parsedItem.kind === "spouse") {
        if (!parent || parent.node.kind !== "person") {
          issues.push(
            issue(
              line,
              parsedItem.column,
              "error",
              "spouse-without-person",
              "A spouse relation must be nested under a person.",
            ),
          );
          return;
        }
        const unionNode = createUnion(
          document,
          parsedItem.unionKind ?? "current",
          [parent.node.personId, person.id],
          line,
          parent.node.personId,
        );
        parent.node.unions.push(unionNode);
        stack.push({ level, node: unionNode });
        return;
      }

      if (parsedItem.partnerText) {
        const partnerDraft = parsePerson(
          parsedItem.partnerText,
          line,
          parsedItem.column,
          issues,
        );
        if (!partnerDraft) return;
        const partner = getOrCreatePerson(document, partnerDraft);

        if (!parent) {
          const personNode = createPersonNode(
            person.id,
            line,
            parsedItem.relationKind,
          );
          const unionNode = createUnion(
            document,
            parsedItem.unionKind ?? "current",
            [person.id, partner.id],
            line,
            person.id,
          );
          personNode.unions.push(unionNode);
          document.roots.push(personNode);
          stack.push({ level, node: unionNode });
          return;
        }

        const personNode = createPersonNode(
          person.id,
          line,
          parsedItem.relationKind,
        );
        attachPerson(
          document,
          parent,
          personNode,
          parsedItem.relationKind,
          line,
        );
        const unionNode = createUnion(
          document,
          parsedItem.unionKind ?? "current",
          [person.id, partner.id],
          line,
          person.id,
        );
        personNode.unions.push(unionNode);
        stack.push({ level, node: unionNode });
        return;
      }

      const personNode = createPersonNode(
        person.id,
        line,
        parsedItem.relationKind,
      );
      attachPerson(document, parent, personNode, parsedItem.relationKind, line);
      stack.push({ level, node: personNode });
    });

  const finalDocument: FamilyTreeDocument = {
    title: document.title,
    persons: Array.from(document.personsById.values()),
    unions: document.unions,
    childRelations: document.childRelations,
    roots: document.roots,
  };

  return {
    ok: !issues.some((entry) => entry.severity === "error"),
    document: finalDocument,
    issues,
  };
}

export function parseAndRenderFamilyTreeSvg(
  source: string,
  options: FamilyTreeRenderOptions = {},
): { result: FamilyTreeParseResult; svg: string } {
  const result = parseFamilyTree(source, options);
  return { result, svg: renderFamilyTreeSvg(result, options) };
}

export function renderFamilyTreeSvg(
  input: FamilyTreeParseResult | FamilyTreeDocument,
  options: FamilyTreeRenderOptions = {},
): string {
  const document = "document" in input ? input.document : input;
  const theme = { ...DEFAULT_FAMILY_TREE_THEME, ...options.theme };
  const visualConfig = mergeFamilyTreeVisualConfig(options.visualConfig);

  let cardWidth = options.cardWidth ?? 188;
  let cardHeight = options.cardHeight ?? 76;

  if (options.cardTemplateSvg) {
    const templateMatch = options.cardTemplateSvg.match(/viewBox="[^"]* ([^" ]+) ([^" ]+)"/);
    if (templateMatch) {
      cardWidth = parseFloat(templateMatch[1]);
      cardHeight = parseFloat(templateMatch[2]);
    }
  }

  const context: RenderContext = {
    document,
    personById: new Map(document.persons.map((person) => [person.id, person])),
    unionById: new Map(document.unions.map((union) => [union.id, union])),
    options: {
      cardWidth,
      cardHeight,
      cardTemplateSvg: options.cardTemplateSvg ?? null,
      levelGap: options.levelGap ?? 92,
      siblingGap: options.siblingGap ?? 32,
      partnerGap: options.partnerGap ?? 24,
      padding: options.padding ?? 32,
      showLegend: options.showLegend ?? false,
      title: options.title ?? document.title,
      indentSize: options.indentSize ?? 2,
    },
    theme,
    visualConfig,
    parts: [],
  };

  const rows = extractRows(document.roots, context);
  const bounds = computeRowLayouts(rows, context);
  const contentWidth = bounds.maxX - bounds.minX;
  const contentHeight = bounds.maxY - bounds.minY;
  const titleHeight = context.options.title ? 44 : 0;

  const width = Math.max(640, contentWidth + context.options.padding * 2);

  let legendHeight = 0;
  let legendLayout: ReturnType<typeof layoutLegend> | undefined;

  if (context.options.showLegend) {
    legendLayout = layoutLegend(context, width - context.options.padding * 2);
    legendHeight = legendLayout.height + 20;
  }

  const height = Math.max(
    320,
    contentHeight + context.options.padding * 2 + titleHeight + legendHeight,
  );

  const widthMm = width * 0.26458333;
  const heightMm = height * 0.26458333;

  context.parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${round(widthMm)}mm" height="${round(heightMm)}mm" viewBox="0 0 ${round(width)} ${round(height)}" role="img">`,
    `<rect width="100%" height="100%" fill="${attr(theme.background)}"/>`,
  );

  if (context.options.title) {
    context.parts.push(
      `<text x="${round(width / 2)}" y="${context.options.padding}" text-anchor="middle" dominant-baseline="hanging" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="20" font-weight="700" fill="${attr(theme.text)}">${text(context.options.title)}</text>`,
    );
  }

  const shiftX = context.options.padding - bounds.minX;
  const shiftY = context.options.padding + titleHeight - bounds.minY;

  for (const [depth, nodes] of rows.entries()) {
    for (const node of nodes) {
      node.x += shiftX;
      node.y += shiftY;
      for (const spouse of node.spouses) {
        spouse.x += shiftX;
      }
      for (const union of node.unions) {
        union.weddingX += shiftX;
        union.weddingY += shiftY;
      }
    }
  }

  for (const [depth, nodes] of rows.entries()) {
    for (const node of nodes) {
      renderRowLayoutNode(node, rows, context);
    }
  }

  if (context.options.showLegend && legendLayout) {
    renderLegend(height - legendHeight + 10, legendLayout, context);
  }
  context.parts.push("</svg>");
  return context.parts.join("");
}

function parseItem(
  content: string,
  column: number,
  line: number,
  issues: FamilyTreeIssue[],
): ParsedItem | undefined {
  if (!content) {
    issues.push(
      issue(line, column, "error", "empty-item", "List item cannot be empty."),
    );
    return undefined;
  }
  if (content.startsWith("x+ ")) {
    return {
      kind: "spouse",
      personText: content.slice(3).trim(),
      relationKind: "biological",
      unionKind: "former",
      column,
    };
  }
  if (content.startsWith("+ ")) {
    return {
      kind: "spouse",
      personText: content.slice(2).trim(),
      relationKind: "biological",
      unionKind: "current",
      column,
    };
  }

  let relationKind: FamilyTreeRelationKind = "biological";
  let personText = content;
  if (content.startsWith("a+ ")) {
    relationKind = "adopted";
    personText = content.slice(3).trim();
  } else if (content.startsWith("~ ")) {
    relationKind = "step";
    personText = content.slice(2).trim();
  }

  const inline = findInlineOperator(personText);
  if (!inline) return { kind: "person", personText, relationKind, column };
  return {
    kind: "person",
    personText: personText.slice(0, inline.index).trim(),
    partnerText: personText.slice(inline.index + inline.operator.length).trim(),
    relationKind,
    unionKind: inline.operator === "x+" ? "former" : "current",
    column,
  };
}

function parsePerson(
  raw: string,
  line: number,
  column: number,
  issues: FamilyTreeIssue[],
): PersonDraft | undefined {
  let value = raw.trim();
  if (!value) {
    issues.push(
      issue(
        line,
        column,
        "error",
        "empty-person",
        "Person definition cannot be empty.",
      ),
    );
    return undefined;
  }

  const infoParts: string[] = [];
  value = value.replace(/\{([^{}]*)\}/g, (_, info: string) => {
    if (info.trim()) infoParts.push(info.trim());
    return " ";
  });

  let nickname: string | undefined;
  value = value.replace(/"([^"]*)"/, (_, nick: string) => {
    nickname = nick.trim() || undefined;
    return " ";
  });

  const tags: string[] = [];
  value = value.replace(/\[([^\]]+)\]/g, (_, tagContent: string) => {
    tags.push(
      ...tagContent
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    );
    return " ";
  });

  let explicitId: string | undefined;
  value = value.replace(/@([A-Za-z0-9_-]+)/g, (_, id: string) => {
    explicitId ??= id;
    return " ";
  });

  const dates: string[] = [];
  value = value.replace(/\(([^()]*)\)/g, (_, date: string) => {
    if (date.trim()) dates.push(date.trim());
    return " ";
  });

  const displayName = normalize(value);
  if (!displayName) {
    issues.push(
      issue(line, column, "error", "missing-name", "Person name is required."),
    );
    return undefined;
  }

  const nameParts = displayName.split(" ");
  const surname = nameParts.length > 1 ? (nameParts.at(-1) ?? "") : "";
  const name =
    nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : displayName;
  const parsedDates = parseDateBlock(dates.at(-1));

  return {
    explicitId,
    displayName,
    name,
    surname,
    birthDate: parsedDates.birthDate,
    deathDate: parsedDates.deathDate,
    nickname,
    info: infoParts.length ? infoParts.join("\n") : undefined,
    tags,
    raw,
  };
}

function parseDateBlock(value?: string): {
  birthDate?: string;
  deathDate?: string;
} {
  if (!value) return {};
  const normalized = value.replace(/[–—]/g, "-").trim();
  const yearRange = normalized.match(/^(\d{4})-(\d{4})$/);
  if (yearRange) return { birthDate: yearRange[1], deathDate: yearRange[2] };
  const spacedRange = normalized.match(/^(.+?)\s+-\s+(.+)$/);
  if (spacedRange) {
    return {
      birthDate: spacedRange[1]?.trim(),
      deathDate: spacedRange[2]?.trim(),
    };
  }
  return { birthDate: normalized };
}

function getOrCreatePerson(
  document: MutableDocument,
  draft: PersonDraft,
): FamilyTreePerson {
  const id =
    draft.explicitId ??
    slug(
      [draft.displayName, draft.birthDate, draft.deathDate]
        .filter(Boolean)
        .join("-"),
    );
  const existing = document.personsById.get(id);
  if (existing) {
    existing.tags = Array.from(new Set([...existing.tags, ...draft.tags]));
    existing.birthDate ??= draft.birthDate;
    existing.deathDate ??= draft.deathDate;
    existing.nickname ??= draft.nickname;
    existing.info ??= draft.info;
    return existing;
  }
  const person: FamilyTreePerson = { id, ...draft };
  document.personsById.set(id, person);
  return person;
}

function createPersonNode(
  personId: string,
  line: number,
  incomingRelationKind: FamilyTreeRelationKind,
): FamilyTreePersonNode {
  return { kind: "person", personId, line, incomingRelationKind, unions: [] };
}

function createUnion(
  document: MutableDocument,
  kind: FamilyTreeUnionKind,
  partnerIds: string[],
  line: number,
  anchorPersonId?: string,
): FamilyTreeUnionNode {
  const union: FamilyTreeUnion = {
    id: `u${document.unions.length + 1}`,
    kind,
    partnerIds,
    line,
    anchorPersonId,
  };
  document.unions.push(union);
  return { kind: "union", unionId: union.id, line, children: [] };
}

function createImplicitUnion(
  document: MutableDocument,
  parentId: string,
  childId: string,
  line: number,
): FamilyTreeUnionNode {
  const union: FamilyTreeUnion = {
    id: `implicit-${parentId}-${childId}-${line}`,
    kind: "current",
    partnerIds: [parentId],
    line,
    anchorPersonId: parentId,
  };

  document.unions.push(union);

  return {
    kind: "union",
    unionId: union.id,
    line,
    children: [],
  };
}

function attachPerson(
  document: MutableDocument,
  parent: StackEntry | undefined,
  personNode: FamilyTreePersonNode,
  kind: FamilyTreeRelationKind,
  line: number,
): void {
  if (!parent) {
    document.roots.push(personNode);
    return;
  }
  if (parent.node.kind === "union") {
    parent.node.children.push(personNode);
    document.childRelations.push({
      id: `c${document.childRelations.length + 1}`,
      unionId: parent.node.unionId,
      childId: personNode.personId,
      kind,
      line,
    });
    return;
  }
  const unionNode = createImplicitUnion(
    document,
    parent.node.personId,
    personNode.personId,
    line,
  );
  unionNode.children.push(personNode);
  parent.node.unions.push(unionNode);
  document.childRelations.push({
    id: `c${document.childRelations.length + 1}`,
    parentId: parent.node.personId,
    childId: personNode.personId,
    kind,
    line,
  });
}

function findInlineOperator(
  value: string,
): { index: number; operator: "+" | "x+" } | undefined {
  let quote = false;
  let round = 0;
  let square = 0;
  let curly = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === '"') quote = !quote;
    if (quote) continue;
    if (char === "(") round += 1;
    if (char === ")") round = Math.max(0, round - 1);
    if (char === "[") square += 1;
    if (char === "]") square = Math.max(0, square - 1);
    if (char === "{") curly += 1;
    if (char === "}") curly = Math.max(0, curly - 1);
    if (round || square || curly) continue;
    if (
      char === "x" &&
      value[index + 1] === "+" &&
      isSpace(value[index - 1]) &&
      isSpace(value[index + 2])
    ) {
      return { index, operator: "x+" };
    }
    if (
      char === "+" &&
      isSpace(value[index - 1]) &&
      isSpace(value[index + 1]) &&
      value[index - 1] !== "x"
    ) {
      return { index, operator: "+" };
    }
  }
  return undefined;
}

function extractRows(
  roots: FamilyTreeRootNode[],
  context: RenderContext,
): Map<number, RowLayoutNode[]> {
  const rows = new Map<number, RowLayoutNode[]>();

  function addToRow(depth: number, layoutNode: RowLayoutNode) {
    if (!rows.has(depth)) rows.set(depth, []);
    rows.get(depth)!.push(layoutNode);
  }

  function traverse(node: FamilyTreePersonNode, depth: number) {
    const layoutNode: RowLayoutNode = {
      isDummy: false,
      personId: node.personId,
      node,
      incomingRelationKind: node.incomingRelationKind,
      depth,
      x: 0,
      y: 0,
      spouses: [],
      unions: [],
    };
    addToRow(depth, layoutNode);

    let hasChildrenOrSpouse = false;

    for (const u of node.unions) {
      const unionInfo = context.unionById.get(u.unionId);
      if (!unionInfo) continue;

      const visiblePartnerIds = unionInfo.partnerIds.filter(
        (id) => id !== unionInfo.anchorPersonId,
      );
      const relationType =
        unionInfo.kind === "former" ? "formerSpouse" : "spouse";

      if (visiblePartnerIds.length > 0 || u.children.length > 0) {
        hasChildrenOrSpouse = true;
      }

      for (const partnerId of visiblePartnerIds) {
        layoutNode.spouses.push({
          personId: partnerId,
          unionId: unionInfo.id,
          relationType,
          x: 0,
        });

        layoutNode.unions.push({
          unionId: unionInfo.id,
          spousePersonId: partnerId,
          weddingX: 0,
          weddingY: 0,
          childrenIds: u.children.map((c) => c.personId),
        });

        for (const child of u.children) {
          traverse(child, depth + 1);
        }
      }

      if (visiblePartnerIds.length === 0 && u.children.length > 0) {
        layoutNode.unions.push({
          unionId: unionInfo.id,
          weddingX: 0,
          weddingY: 0,
          childrenIds: u.children.map((c) => c.personId),
        });
        for (const child of u.children) {
          traverse(child, depth + 1);
        }
      }
    }

    if (!hasChildrenOrSpouse) {
      addToRow(depth + 1, {
        isDummy: true,
        depth: depth + 1,
        x: 0,
        y: 0,
        spouses: [],
        unions: [],
      });
    }
  }

  for (const root of roots) {
    if (root.kind === "person") {
      traverse(root, 0);
    }
  }

  return rows;
}

function computeRowLayouts(
  rows: Map<number, RowLayoutNode[]>,
  context: RenderContext,
) {
  const cardW = context.options.cardWidth;
  const cardH = context.options.cardHeight;
  const spouseGap = context.options.partnerGap;
  const siblingGap = spouseGap * 2;
  const levelGap = context.options.levelGap;

  let minGlobalX = Infinity;
  let maxGlobalX = -Infinity;
  let maxGlobalY = -Infinity;

  for (const [depth, nodes] of rows.entries()) {
    let currentX = 0;

    // Assign horizontal positions sequentially
    for (const node of nodes) {
      node.x = currentX;
      currentX += cardW;

      for (const spouse of node.spouses) {
        // Use 1.5n gap for former spouses to detach them visually
        const gap =
          spouse.relationType === "formerSpouse" ? spouseGap * 1.5 : spouseGap;
        currentX += gap;
        spouse.x = currentX;
        currentX += cardW;
      }
      currentX += siblingGap;
    }

    const rowWidth = currentX - siblingGap;
    const shiftX = -(rowWidth / 2);
    const rowY = depth * (cardH + levelGap);

    for (const node of nodes) {
      node.x += shiftX;
      node.y = rowY;

      if (node.x < minGlobalX) minGlobalX = node.x;
      if (node.x + cardW > maxGlobalX) maxGlobalX = node.x + cardW;
      if (node.y + cardH > maxGlobalY) maxGlobalY = node.y + cardH;

      const anchorCenter = node.x + cardW / 2;

      for (const spouse of node.spouses) {
        spouse.x += shiftX;
        if (spouse.x + cardW > maxGlobalX) maxGlobalX = spouse.x + cardW;

        const spouseCenter = spouse.x + cardW / 2;
        const union = node.unions.find(
          (u) => u.spousePersonId === spouse.personId,
        );
        if (union) {
          union.weddingX = spouseCenter;
          union.weddingY = rowY + cardH + 26;
        }
      }

      for (const union of node.unions) {
        if (!union.spousePersonId) {
          union.weddingX = anchorCenter;
          union.weddingY = rowY + cardH + 26;
        }
        if (union.weddingY + 5 > maxGlobalY) maxGlobalY = union.weddingY + 5;
      }
    }
  }

  return { minX: minGlobalX, maxX: maxGlobalX, minY: 0, maxY: maxGlobalY };
}

function renderRowLayoutNode(
  node: RowLayoutNode,
  rows: Map<number, RowLayoutNode[]>,
  context: RenderContext,
) {
  if (node.isDummy) return;

  const person = context.personById.get(node.personId!);
  renderCard(
    person,
    node.x,
    node.y,
    context,
    node.incomingRelationKind || "biological",
  );

  for (const spouse of node.spouses) {
    const spousePerson = context.personById.get(spouse.personId);
    renderCard(spousePerson, spouse.x, node.y, context, spouse.relationType);
  }

  const isCurved = context.visualConfig.connectors.shape === "curved";

  for (const union of node.unions) {
    const unionPoint = { x: union.weddingX, y: union.weddingY };

    const spouse = node.spouses.find(
      (s) => s.personId === union.spousePersonId,
    );
    if (spouse) {
      const spouseBottom = {
        x: spouse.x + context.options.cardWidth / 2,
        y: node.y + context.options.cardHeight,
      };
      drawConnector(spouseBottom, unionPoint, context, "biological");
    }

    const anchorBottom = {
      x: node.x + context.options.cardWidth / 2,
      y: node.y + context.options.cardHeight,
    };
    drawConnector(anchorBottom, unionPoint, context, "biological");

    const bloodlineRule = context.visualConfig.relations.biological;
    context.parts.push(
      `<circle cx="${round(unionPoint.x)}" cy="${round(unionPoint.y)}" r="5" fill="${attr(bloodlineRule.color)}"/>`,
    );

    if (union.childrenIds.length > 0) {
      const childNodes = (rows.get(node.depth + 1) || []).filter(
        (n) => !n.isDummy && union.childrenIds.includes(n.personId!),
      );

      const allUnionsInRow = rows.get(node.depth)!.flatMap((n) => n.unions).filter((u) => u.childrenIds.length > 0);
      const unionIndex = allUnionsInRow.findIndex((u) => u.unionId === union.unionId);
      const stagger = unionIndex % 2 === 0 ? 14 : 28;

      for (const child of childNodes) {
        const childAnchorCenter = {
          x: child.x + context.options.cardWidth / 2,
          y: child.y,
        };
        const childPerson = context.personById.get(child.personId!);
        const childColor = resolvePersonEffectiveColor(
          childPerson,
          child.incomingRelationKind || "biological",
          context.visualConfig,
        );
        const rule =
          context.visualConfig.relations[
          child.incomingRelationKind || "biological"
          ];

        if (isCurved) {
          const path = curvedPath(unionPoint, childAnchorCenter);
          context.parts.push(
            `<path d="${path}" fill="none" stroke="${attr(childColor)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${dash(rule.lineStyle)}/>`,
          );
        } else {
          const horizontalY = unionPoint.y + stagger;
          const path = `M ${round(unionPoint.x)} ${round(unionPoint.y)} V ${round(horizontalY)} H ${round(childAnchorCenter.x)} V ${round(childAnchorCenter.y)}`;
          context.parts.push(
            `<path d="${path}" fill="none" stroke="${attr(childColor)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${dash(rule.lineStyle)}/>`,
          );
        }
      }
    }
  }
}

function renderCard(
  person: FamilyTreePerson | undefined,
  x: number,
  y: number,
  context: RenderContext,
  incomingRelation: keyof FamilyTreeVisualConfig["relations"],
): Point {
  const visual = resolvePersonVisual(
    person,
    incomingRelation,
    context.visualConfig,
  );
  const displayName = person?.displayName ?? "Unknown";
  const dates = formatDates(person);

  if (context.options.cardTemplateSvg) {
    let svgContent = context.options.cardTemplateSvg
      .replace(/\{\{displayName\}\}/g, text(truncate(displayName, 24)))
      .replace(/\{\{strokeColor\}\}/g, attr(visual.borderColor))
      .replace(/\{\{fillColor\}\}/g, attr(context.theme.cardBackground))
      .replace(/\{\{textColor\}\}/g, attr(context.theme.text))
      .replace(/\{\{mutedTextColor\}\}/g, attr(context.theme.mutedText))
      .replace(/\{\{dates\}\}/g, dates ? text(dates) : "")
      .replace(/\{\{nickname\}\}/g, person?.nickname ? text(truncate(`“${person.nickname}”`, 26)) : "")
      .replace(/\{\{tags\}\}/g, buildTagsSvg(person?.tags ?? [], context));

    let innerSvg = svgContent.replace(/<\?xml[^>]*>/, '').replace(/<!--[\s\S]*?-->/g, '').trim();
    innerSvg = innerSvg.replace(/^<svg[^>]*>/, `<g transform="translate(${round(x)}, ${round(y)})">`);
    innerSvg = innerSvg.replace(/<\/svg>$/, `</g>`);
    
    context.parts.push(innerSvg);
  } else {
    context.parts.push(
      `<rect x="${round(x)}" y="${round(y)}" width="${context.options.cardWidth}" height="${context.options.cardHeight}" rx="14" fill="${attr(context.theme.cardBackground)}" stroke="${attr(visual.borderColor)}" stroke-width="2"/>`,
      `<text x="${round(x + 14)}" y="${round(y + 20)}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="13" font-weight="700" fill="${attr(context.theme.text)}">${text(truncate(displayName, 24))}</text>`,
    );

    if (person?.nickname) {
      context.parts.push(
        `<text x="${round(x + 14)}" y="${round(y + 38)}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="11" fill="${attr(context.theme.mutedText)}">${text(truncate(`“${person.nickname}”`, 26))}</text>`,
      );
    }
    if (dates) {
      context.parts.push(
        `<text x="${round(x + 14)}" y="${round(y + (person?.nickname ? 56 : 40))}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="11" fill="${attr(context.theme.mutedText)}">${text(dates)}</text>`,
      );
    }
    renderTags(
      person?.tags ?? [],
      x + context.options.cardWidth - 12,
      y + 12,
      context,
    );
  }

  return {
    x: x + context.options.cardWidth / 2,
    y: y + context.options.cardHeight,
  };
}

function resolvePersonEffectiveColor(
  person: FamilyTreePerson | undefined,
  incomingRelation: keyof FamilyTreeVisualConfig["relations"],
  config: FamilyTreeVisualConfig,
) {
  const statusColor = findVisibleStatusColor(person?.tags ?? [], config);
  return statusColor ?? config.relations[incomingRelation].color;
}

function resolvePersonVisual(
  person: FamilyTreePerson | undefined,
  incomingRelation: keyof FamilyTreeVisualConfig["relations"],
  config: FamilyTreeVisualConfig,
) {
  const relationRule = config.relations[incomingRelation];
  const baseColor = resolvePersonEffectiveColor(
    person,
    incomingRelation,
    config,
  );
  const isDeceased = !!person?.deathDate;

  return {
    borderColor: isDeceased
      ? desaturateHexColor(baseColor, config.deceased.desaturate)
      : baseColor,
    lineStyle: relationRule.lineStyle,
  };
}

function formatStatusLabel(tag: string): string {
  if (tag.startsWith("m:")) {
    return tag.slice(2);
  }
  return tag;
}

function renderTags(
  tags: string[],
  rightX: number,
  y: number,
  context: RenderContext,
): void {
  let cursorX = rightX;
  for (const tag of tags.slice(0, 3).reverse()) {
    const color = findStatusColor(tag, context.visualConfig);
    if (!color) continue;
    const label = formatStatusLabel(tag);
    const width = Math.max(24, label.length * 7 + 10);
    cursorX -= width;

    context.parts.push(
      `<rect x="${round(cursorX)}" y="${round(y)}" width="${round(width)}" height="18" rx="9" fill="${attr(color)}"/>`,
      `<text x="${round(cursorX + width / 2)}" y="${round(y + 12.5)}" text-anchor="middle" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="10" font-weight="700" fill="#ffffff">${text(label)}</text>`,
    );
    cursorX -= 4;
  }
}

function buildTagsSvg(
  tags: string[],
  context: RenderContext,
): string {
  let parts: string[] = [];
  let cursorX = 0;
  for (const tag of tags.slice(0, 3).reverse()) {
    const color = findStatusColor(tag, context.visualConfig);
    if (!color) continue;
    const label = formatStatusLabel(tag);
    const width = Math.max(24, label.length * 7 + 10);
    cursorX -= width;

    parts.push(
      `<rect x="${round(cursorX)}" y="0" width="${round(width)}" height="18" rx="9" fill="${attr(color)}"/>`,
      `<text x="${round(cursorX + width / 2)}" y="12.5" text-anchor="middle" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="10" font-weight="700" fill="#ffffff">${text(label)}</text>`,
    );
    cursorX -= 4;
  }
  return parts.join("");
}

function drawConnector(
  from: Point,
  to: Point,
  context: RenderContext,
  relationType: keyof FamilyTreeVisualConfig["relations"],
): void {
  const rule = context.visualConfig.relations[relationType];
  const path =
    context.visualConfig.connectors.shape === "elbow"
      ? elbowPath(from, to)
      : curvedPath(from, to);
  context.parts.push(
    `<path d="${path}" fill="none" stroke="${attr(rule.color)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${dash(rule.lineStyle)}/>`,
  );
}

function layoutLegend(context: RenderContext, maxWidth: number) {
  const items = Object.values(context.visualConfig.relations).map((rule) => ({
    label: rule.label,
    color: rule.color,
    width: 24 + rule.label.length * 7,
  }));

  const rows: Array<
    Array<{ x: number; y: number; label: string; color: string; width: number }>
  > = [];
  let currentRow: Array<{
    x: number;
    y: number;
    label: string;
    color: string;
    width: number;
  }> = [];
  let currentRowWidth = 0;
  const itemGap = 32;
  const rowHeight = 24;

  for (const item of items) {
    if (currentRowWidth + item.width > maxWidth && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [];
      currentRowWidth = 0;
    }
    currentRow.push({ ...item, x: 0, y: 0 });
    currentRowWidth += item.width + (currentRow.length > 1 ? itemGap : 0);
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowWidth =
      row.reduce((sum, item) => sum + item.width, 0) +
      (row.length - 1) * itemGap;
    let currentX = maxWidth / 2 - rowWidth / 2;
    for (const item of row) {
      item.x = currentX;
      item.y = i * rowHeight;
      currentX += item.width + itemGap;
    }
  }

  return { rows, width: maxWidth, height: rows.length * rowHeight };
}

function renderLegend(
  y: number,
  legendLayout: ReturnType<typeof layoutLegend>,
  context: RenderContext,
): void {
  for (const row of legendLayout.rows) {
    for (const item of row) {
      const cx = item.x + context.options.padding;
      context.parts.push(
        `<circle cx="${round(cx + 8)}" cy="${round(y + item.y)}" r="5" fill="${attr(item.color)}"/>`,
        `<text x="${round(cx + 18)}" y="${round(y + item.y + 4)}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="11" fill="${attr(context.theme.mutedText)}">${text(item.label)}</text>`,
      );
    }
  }
}

function curvedPath(from: Point, to: Point): string {
  const midY = from.y + (to.y - from.y) / 2;
  return `M ${round(from.x)} ${round(from.y)} C ${round(from.x)} ${round(midY)}, ${round(to.x)} ${round(midY)}, ${round(to.x)} ${round(to.y)}`;
}

function elbowPath(from: Point, to: Point): string {
  if (Math.abs(from.x - to.x) < 0.5 || Math.abs(from.y - to.y) < 0.5) {
    return `M ${round(from.x)} ${round(from.y)} L ${round(to.x)} ${round(to.y)}`;
  }
  return `M ${round(from.x)} ${round(from.y)} L ${round(from.x)} ${round(to.y)} L ${round(to.x)} ${round(to.y)}`;
}

function dash(lineStyle: FamilyTreeLineStyle): string {
  if (lineStyle === "dashed") return ' stroke-dasharray="6 5"';
  if (lineStyle === "dotted") return ' stroke-dasharray="2 4"';
  return "";
}

function findVisibleStatusColor(
  tags: string[],
  config: FamilyTreeVisualConfig,
): string | undefined {
  for (const tag of tags) {
    const color = findStatusColor(tag, config);
    if (color) return color;
  }
  return undefined;
}

function findStatusColor(
  tag: string,
  config: FamilyTreeVisualConfig,
): string | undefined {
  if (tag === "v" && config.statuses.heir.visible) {
    return config.statuses.heir.color;
  }
  if (tag.startsWith("m") && config.statuses.inheritance.visible) {
    return config.statuses.inheritance.color;
  }
  if (tag === "x" && config.statuses.excluded.visible) {
    return config.statuses.excluded.color;
  }
  if (tag === "red" && config.statuses.renounced.visible) {
    return config.statuses.renounced.color;
  }
  if (tag === "will" && config.statuses.will.visible) {
    return config.statuses.will.color;
  }
  return undefined;
}

function formatDates(person?: FamilyTreePerson): string | undefined {
  if (!person?.birthDate && !person?.deathDate) return undefined;
  if (person.birthDate && person.deathDate) {
    return `${person.birthDate} – ${person.deathDate}`;
  }
  return person.birthDate ?? `† ${person.deathDate}`;
}

function issue(
  line: number,
  column: number,
  severity: FamilyTreeIssueSeverity,
  code: string,
  message: string,
): FamilyTreeIssue {
  return { line, column, severity, code, message };
}

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function slug(value: string): string {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "person"
  );
}

function truncate(value: string, maxLength: number): string {
  return value.length <= maxLength
    ? value
    : `${value.slice(0, Math.max(0, maxLength - 1))}…`;
}

function isSpace(value: string | undefined): boolean {
  return value === undefined || /\s/.test(value);
}

function text(value: string | undefined): string {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function attr(value: string): string {
  return text(value).replace(/"/g, "&quot;");
}

function round(value: number): string {
  return Number(value.toFixed(2)).toString();
}

function desaturateHexColor(hex: string, amount: number): string {
  if (amount <= 0) return hex;
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const desaturateFactor = Math.min(100, Math.max(0, amount)) / 100;
  const nr = Math.round(r + (luminance - r) * desaturateFactor);
  const ng = Math.round(g + (luminance - g) * desaturateFactor);
  const nb = Math.round(b + (luminance - b) * desaturateFactor);

  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}
