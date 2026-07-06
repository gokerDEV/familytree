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
  bloodline: string;
  spouse: string;
  formerSpouse: string;
  adopted: string;
  step: string;
  heir: string;
  inheritance: string;
  excluded: string;
  connector: string;
};

export type FamilyTreeRenderOptions = FamilyTreeParseOptions & {
  theme?: Partial<FamilyTreeTheme>;
  cardWidth?: number;
  cardHeight?: number;
  levelGap?: number;
  siblingGap?: number;
  partnerGap?: number;
  padding?: number;
  showLegend?: boolean;
  title?: string;
};

export const DEFAULT_FAMILY_TREE_THEME: FamilyTreeTheme = {
  background: "#ffffff",
  text: "#18181b",
  mutedText: "#71717a",
  cardBackground: "#ffffff",
  bloodline: "#2563eb",
  spouse: "#7c3aed",
  formerSpouse: "#a1a1aa",
  adopted: "#059669",
  step: "#f97316",
  heir: "#dc2626",
  inheritance: "#ca8a04",
  excluded: "#52525b",
  connector: "#94a3b8",
};

export const DEFAULT_FAMILY_TREE_EXAMPLE = `# Yılmaz Krallığı / Ailesi

- Ahmet Yılmaz @ahmet1945 "Kral Ahmet" (1945) + Ayşe Yılmaz @ayse1948 "Kraliçe Ayşe" (1948)
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
type LayoutPerson = Size & { kind: "person"; node: FamilyTreePersonNode; unions: LayoutUnion[] };
type LayoutUnion = Size & {
  kind: "union";
  node: FamilyTreeUnionNode;
  visiblePartnerIds: string[];
  children: LayoutPerson[];
  partnerRowWidth: number;
  partnerRowHeight: number;
  childrenWidth: number;
};

type RenderContext = {
  document: FamilyTreeDocument;
  personById: Map<string, FamilyTreePerson>;
  unionById: Map<string, FamilyTreeUnion>;
  options: Required<Omit<FamilyTreeRenderOptions, "theme" | "title" | "indentSize">> & {
    title?: string;
    indentSize: number;
  };
  theme: FamilyTreeTheme;
  parts: string[];
};

export function parseFamilyTree(source: string, options: FamilyTreeParseOptions = {}): FamilyTreeParseResult {
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
        issues.push(issue(line, 1, "error", "tab-indent", "Tab indentation is not supported. Use spaces."));
        return;
      }

      const match = rawLine.match(/^(\s*)-\s+(.+)$/);
      if (!match) {
        issues.push(issue(line, 1, "error", "invalid-line", "Expected a markdown list item starting with '-'."));
        return;
      }

      const indent = match[1]?.length ?? 0;
      if (indent % indentSize !== 0) {
        issues.push(issue(line, indent + 1, "error", "invalid-indent", `Indentation must use ${indentSize} spaces per level.`));
        return;
      }

      const level = indent / indentSize;
      if (level > stack.length) {
        issues.push(issue(line, indent + 1, "error", "indent-jump", "Indentation can only increase by one level at a time."));
        return;
      }

      stack.length = level;
      const parsedItem = parseItem(match[2]?.trim() ?? "", indent + 3, line, issues);
      if (!parsedItem) return;

      const parent = stack[level - 1];
      const personDraft = parsePerson(parsedItem.personText, line, parsedItem.column, issues);
      if (!personDraft) return;
      const person = getOrCreatePerson(document, personDraft);

      if (parsedItem.kind === "spouse") {
        if (!parent || parent.node.kind !== "person") {
          issues.push(issue(line, parsedItem.column, "error", "spouse-without-person", "A spouse relation must be nested under a person."));
          return;
        }
        const unionNode = createUnion(document, parsedItem.unionKind ?? "current", [parent.node.personId, person.id], line, parent.node.personId);
        parent.node.unions.push(unionNode);
        stack.push({ level, node: unionNode });
        return;
      }

      if (parsedItem.partnerText) {
        const partnerDraft = parsePerson(parsedItem.partnerText, line, parsedItem.column, issues);
        if (!partnerDraft) return;
        const partner = getOrCreatePerson(document, partnerDraft);

        if (!parent) {
          const unionNode = createUnion(document, parsedItem.unionKind ?? "current", [person.id, partner.id], line);
          document.roots.push(unionNode);
          stack.push({ level, node: unionNode });
          return;
        }

        const personNode = createPersonNode(person.id, line, parsedItem.relationKind);
        attachPerson(document, parent, personNode, parsedItem.relationKind, line);
        const unionNode = createUnion(document, parsedItem.unionKind ?? "current", [person.id, partner.id], line, person.id);
        personNode.unions.push(unionNode);
        stack.push({ level, node: unionNode });
        return;
      }

      const personNode = createPersonNode(person.id, line, parsedItem.relationKind);
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

export function renderFamilyTreeSvg(input: FamilyTreeParseResult | FamilyTreeDocument, options: FamilyTreeRenderOptions = {}): string {
  const document = "document" in input ? input.document : input;
  const theme = { ...DEFAULT_FAMILY_TREE_THEME, ...options.theme };
  const context: RenderContext = {
    document,
    personById: new Map(document.persons.map((person) => [person.id, person])),
    unionById: new Map(document.unions.map((union) => [union.id, union])),
    options: {
      cardWidth: options.cardWidth ?? 188,
      cardHeight: options.cardHeight ?? 76,
      levelGap: options.levelGap ?? 92,
      siblingGap: options.siblingGap ?? 32,
      partnerGap: options.partnerGap ?? 24,
      padding: options.padding ?? 32,
      showLegend: options.showLegend ?? false,
      title: options.title ?? document.title,
      indentSize: options.indentSize ?? 2,
    },
    theme,
    parts: [],
  };

  const roots = document.roots.map((root) => (root.kind === "person" ? layoutPerson(root, context) : layoutUnion(root, context)));
  const contentWidth = sumWidths(roots, context.options.siblingGap);
  const contentHeight = roots.reduce((height, root) => Math.max(height, root.height), 0);
  const titleHeight = context.options.title ? 44 : 0;
  const legendHeight = context.options.showLegend ? 42 : 0;
  const width = Math.max(640, contentWidth + context.options.padding * 2);
  const height = Math.max(320, contentHeight + context.options.padding * 2 + titleHeight + legendHeight);

  context.parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${round(width)}" height="${round(height)}" viewBox="0 0 ${round(width)} ${round(height)}" role="img">`,
    `<rect width="100%" height="100%" fill="${attr(theme.background)}"/>`,
  );

  if (context.options.title) {
    context.parts.push(
      `<text x="${round(width / 2)}" y="${context.options.padding}" text-anchor="middle" dominant-baseline="hanging" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="20" font-weight="700" fill="${attr(theme.text)}">${text(context.options.title)}</text>`,
    );
  }

  let cursorX = context.options.padding;
  const rootY = context.options.padding + titleHeight;
  for (const root of roots) {
    if (root.kind === "person") renderPerson(root, cursorX, rootY, context);
    else renderUnion(root, cursorX, rootY, context);
    cursorX += root.width + context.options.siblingGap;
  }

  if (context.options.showLegend) renderLegend(width / 2, height - context.options.padding - 10, context);
  context.parts.push("</svg>");
  return context.parts.join("");
}

function parseItem(content: string, column: number, line: number, issues: FamilyTreeIssue[]): ParsedItem | undefined {
  if (!content) {
    issues.push(issue(line, column, "error", "empty-item", "List item cannot be empty."));
    return undefined;
  }
  if (content.startsWith("x+ ")) return { kind: "spouse", personText: content.slice(3).trim(), relationKind: "biological", unionKind: "former", column };
  if (content.startsWith("+ ")) return { kind: "spouse", personText: content.slice(2).trim(), relationKind: "biological", unionKind: "current", column };

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

function parsePerson(raw: string, line: number, column: number, issues: FamilyTreeIssue[]): PersonDraft | undefined {
  let value = raw.trim();
  if (!value) {
    issues.push(issue(line, column, "error", "empty-person", "Person definition cannot be empty."));
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
    tags.push(...tagContent.split(",").map((tag) => tag.trim()).filter(Boolean));
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
    issues.push(issue(line, column, "error", "missing-name", "Person name is required."));
    return undefined;
  }

  const nameParts = displayName.split(" ");
  const surname = nameParts.length > 1 ? (nameParts.at(-1) ?? "") : "";
  const name = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : displayName;
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

function parseDateBlock(value?: string): { birthDate?: string; deathDate?: string } {
  if (!value) return {};
  const normalized = value.replace(/[–—]/g, "-").trim();
  const yearRange = normalized.match(/^(\d{4})-(\d{4})$/);
  if (yearRange) return { birthDate: yearRange[1], deathDate: yearRange[2] };
  const spacedRange = normalized.match(/^(.+?)\s+-\s+(.+)$/);
  if (spacedRange) return { birthDate: spacedRange[1]?.trim(), deathDate: spacedRange[2]?.trim() };
  return { birthDate: normalized };
}

function getOrCreatePerson(document: MutableDocument, draft: PersonDraft): FamilyTreePerson {
  const id = draft.explicitId ?? slug([draft.displayName, draft.birthDate, draft.deathDate].filter(Boolean).join("-"));
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

function createPersonNode(personId: string, line: number, incomingRelationKind: FamilyTreeRelationKind): FamilyTreePersonNode {
  return { kind: "person", personId, line, incomingRelationKind, unions: [] };
}

function createUnion(document: MutableDocument, kind: FamilyTreeUnionKind, partnerIds: string[], line: number, anchorPersonId?: string): FamilyTreeUnionNode {
  const union: FamilyTreeUnion = { id: `u${document.unions.length + 1}`, kind, partnerIds, line, anchorPersonId };
  document.unions.push(union);
  return { kind: "union", unionId: union.id, line, children: [] };
}

function attachPerson(document: MutableDocument, parent: StackEntry | undefined, personNode: FamilyTreePersonNode, kind: FamilyTreeRelationKind, line: number): void {
  if (!parent) {
    document.roots.push(personNode);
    return;
  }
  if (parent.node.kind === "union") {
    parent.node.children.push(personNode);
    document.childRelations.push({ id: `c${document.childRelations.length + 1}`, unionId: parent.node.unionId, childId: personNode.personId, kind, line });
    return;
  }
  const unionNode: FamilyTreeUnionNode = { kind: "union", unionId: `implicit-${parent.node.personId}-${personNode.personId}-${line}`, line, children: [personNode] };
  parent.node.unions.push(unionNode);
  document.childRelations.push({ id: `c${document.childRelations.length + 1}`, parentId: parent.node.personId, childId: personNode.personId, kind, line });
}

function findInlineOperator(value: string): { index: number; operator: "+" | "x+" } | undefined {
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
    if (char === "x" && value[index + 1] === "+" && isSpace(value[index - 1]) && isSpace(value[index + 2])) return { index, operator: "x+" };
    if (char === "+" && isSpace(value[index - 1]) && isSpace(value[index + 1]) && value[index - 1] !== "x") return { index, operator: "+" };
  }
  return undefined;
}

function layoutPerson(node: FamilyTreePersonNode, context: RenderContext): LayoutPerson {
  const unions = node.unions.map((union) => layoutUnion(union, context));
  if (!unions.length) return { kind: "person", node, unions, width: context.options.cardWidth, height: context.options.cardHeight };
  const unionWidth = sumWidths(unions, context.options.siblingGap);
  const unionHeight = unions.reduce((max, union) => Math.max(max, union.height), 0);
  return {
    kind: "person",
    node,
    unions,
    width: Math.max(context.options.cardWidth, unionWidth),
    height: context.options.cardHeight + context.options.levelGap + unionHeight,
  };
}

function layoutUnion(node: FamilyTreeUnionNode, context: RenderContext): LayoutUnion {
  const union = context.unionById.get(node.unionId);
  const visiblePartnerIds = union ? union.partnerIds.filter((id) => id !== union.anchorPersonId) : [];
  const partnerCount = Math.max(visiblePartnerIds.length, 1);
  const partnerRowWidth = visiblePartnerIds.length ? partnerCount * context.options.cardWidth + (partnerCount - 1) * context.options.partnerGap : 24;
  const partnerRowHeight = visiblePartnerIds.length ? context.options.cardHeight : 24;
  const children = node.children.map((child) => layoutPerson(child, context));
  const childrenWidth = sumWidths(children, context.options.siblingGap);
  const childrenHeight = children.reduce((max, child) => Math.max(max, child.height), 0);
  return {
    kind: "union",
    node,
    visiblePartnerIds,
    children,
    partnerRowWidth,
    partnerRowHeight,
    childrenWidth,
    width: Math.max(partnerRowWidth, childrenWidth, context.options.cardWidth),
    height: partnerRowHeight + (children.length ? context.options.levelGap + childrenHeight : 0),
  };
}

function renderPerson(layout: LayoutPerson, x: number, y: number, context: RenderContext): Point {
  const cardX = x + layout.width / 2 - context.options.cardWidth / 2;
  const person = context.personById.get(layout.node.personId);
  const bottom = renderCard(person, cardX, y, context, visualKind(layout.node.incomingRelationKind, person));
  if (!layout.unions.length) return bottom;

  let unionX = x + (layout.width - sumWidths(layout.unions, context.options.siblingGap)) / 2;
  const unionY = y + context.options.cardHeight + context.options.levelGap;
  for (const union of layout.unions) {
    const top = renderUnion(union, unionX, unionY, context, bottom);
    drawConnector(bottom, top, context, unionConnectorKind(context.unionById.get(union.node.unionId)));
    unionX += union.width + context.options.siblingGap;
  }
  return bottom;
}

function renderUnion(layout: LayoutUnion, x: number, y: number, context: RenderContext, anchor?: Point): Point {
  const union = context.unionById.get(layout.node.unionId);
  const connectorKind = unionConnectorKind(union);
  let partnerX = x + layout.width / 2 - layout.partnerRowWidth / 2;
  const unionPoint = { x: x + layout.width / 2, y: y + layout.partnerRowHeight + 22 };

  for (const partnerId of layout.visiblePartnerIds) {
    const bottom = renderCard(context.personById.get(partnerId), partnerX, y, context, union?.kind === "former" ? "former-spouse" : "spouse");
    drawConnector(bottom, unionPoint, context, connectorKind);
    partnerX += context.options.cardWidth + context.options.partnerGap;
  }

  if (anchor) drawConnector(anchor, unionPoint, context, connectorKind);
  context.parts.push(`<circle cx="${round(unionPoint.x)}" cy="${round(unionPoint.y)}" r="5" fill="${attr(connectorColor(connectorKind, context))}"/>`);

  if (layout.children.length) {
    const horizontalY = unionPoint.y + 22;
    let childX = x + layout.width / 2 - layout.childrenWidth / 2;
    const firstCenter = childX + layout.children[0].width / 2;
    const lastCenter = childX + layout.childrenWidth - layout.children[layout.children.length - 1].width / 2;
    drawConnector(unionPoint, { x: unionPoint.x, y: horizontalY }, context, connectorKind);
    context.parts.push(`<path d="M ${round(firstCenter)} ${round(horizontalY)} H ${round(lastCenter)}" fill="none" stroke="${attr(connectorColor(connectorKind, context))}" stroke-width="2" stroke-linecap="round"${dash(connectorKind)}/>`);
    for (const child of layout.children) {
      const childCenter = childX + child.width / 2;
      drawConnector({ x: childCenter, y: horizontalY }, { x: childCenter, y: y + layout.partnerRowHeight + context.options.levelGap }, context, childConnectorKind(child.node.incomingRelationKind));
      renderPerson(child, childX, y + layout.partnerRowHeight + context.options.levelGap, context);
      childX += child.width + context.options.siblingGap;
    }
  }

  return unionPoint;
}

function renderCard(person: FamilyTreePerson | undefined, x: number, y: number, context: RenderContext, kind: "bloodline" | "spouse" | "former-spouse" | "adopted" | "step" | "heir" | "excluded"): Point {
  const stroke = cardColor(kind, context.theme);
  const fill = kind === "heir" ? tint(context.theme.heir, 0.94) : context.theme.cardBackground;
  const displayName = person?.displayName ?? "Unknown";
  const dates = formatDates(person);

  context.parts.push(
    `<rect x="${round(x)}" y="${round(y)}" width="${context.options.cardWidth}" height="${context.options.cardHeight}" rx="14" fill="${attr(fill)}" stroke="${attr(stroke)}" stroke-width="2"/>`,
    `<text x="${round(x + 14)}" y="${round(y + 20)}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="13" font-weight="700" fill="${attr(context.theme.text)}">${text(truncate(displayName, 24))}</text>`,
  );

  if (person?.nickname) {
    context.parts.push(`<text x="${round(x + 14)}" y="${round(y + 38)}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="11" fill="${attr(context.theme.mutedText)}">${text(truncate(`“${person.nickname}”`, 26))}</text>`);
  }
  if (dates) {
    context.parts.push(`<text x="${round(x + 14)}" y="${round(y + (person?.nickname ? 56 : 40))}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="11" fill="${attr(context.theme.mutedText)}">${text(dates)}</text>`);
  }
  renderTags(person?.tags ?? [], x + context.options.cardWidth - 12, y + 12, context);
  return { x: x + context.options.cardWidth / 2, y: y + context.options.cardHeight };
}

function renderTags(tags: string[], rightX: number, y: number, context: RenderContext): void {
  let cursorX = rightX;
  for (const tag of tags.slice(0, 3).reverse()) {
    const label = `[${tag}]`;
    const width = Math.max(24, label.length * 7 + 10);
    cursorX -= width;
    context.parts.push(
      `<rect x="${round(cursorX)}" y="${round(y)}" width="${round(width)}" height="18" rx="9" fill="${attr(tagColor(tag, context.theme))}"/>`,
      `<text x="${round(cursorX + width / 2)}" y="${round(y + 12.5)}" text-anchor="middle" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="10" font-weight="700" fill="#ffffff">${text(label)}</text>`,
    );
    cursorX -= 4;
  }
}

function drawConnector(from: Point, to: Point, context: RenderContext, kind: "normal" | "former" | "adopted" | "step"): void {
  const midY = from.y + (to.y - from.y) / 2;
  const path = `M ${round(from.x)} ${round(from.y)} C ${round(from.x)} ${round(midY)}, ${round(to.x)} ${round(midY)}, ${round(to.x)} ${round(to.y)}`;
  context.parts.push(`<path d="${path}" fill="none" stroke="${attr(connectorColor(kind, context))}" stroke-width="2" stroke-linecap="round"${dash(kind)}/>`);
}

function renderLegend(centerX: number, y: number, context: RenderContext): void {
  const items: Array<[string, string]> = [
    ["Asıl soy", context.theme.bloodline],
    ["Eş", context.theme.spouse],
    ["Eski eş", context.theme.formerSpouse],
    ["Evlatlık", context.theme.adopted],
    ["Üvey", context.theme.step],
    ["Varis", context.theme.heir],
  ];
  let x = centerX - (items.length * 96) / 2;
  for (const [label, color] of items) {
    context.parts.push(
      `<circle cx="${round(x + 8)}" cy="${round(y)}" r="5" fill="${attr(color)}"/>`,
      `<text x="${round(x + 18)}" y="${round(y + 4)}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="11" fill="${attr(context.theme.mutedText)}">${text(label)}</text>`,
    );
    x += 96;
  }
}

function visualKind(kind: FamilyTreeRelationKind, person?: FamilyTreePerson): "bloodline" | "adopted" | "step" | "heir" | "excluded" {
  if (person?.tags.includes("x") || person?.tags.includes("red")) return "excluded";
  if (person?.tags.includes("v")) return "heir";
  if (kind === "adopted") return "adopted";
  if (kind === "step") return "step";
  return "bloodline";
}

function unionConnectorKind(union?: FamilyTreeUnion): "normal" | "former" {
  return union?.kind === "former" ? "former" : "normal";
}

function childConnectorKind(kind: FamilyTreeRelationKind): "normal" | "adopted" | "step" {
  if (kind === "adopted") return "adopted";
  if (kind === "step") return "step";
  return "normal";
}

function cardColor(kind: "bloodline" | "spouse" | "former-spouse" | "adopted" | "step" | "heir" | "excluded", theme: FamilyTreeTheme): string {
  if (kind === "spouse") return theme.spouse;
  if (kind === "former-spouse") return theme.formerSpouse;
  if (kind === "adopted") return theme.adopted;
  if (kind === "step") return theme.step;
  if (kind === "heir") return theme.heir;
  if (kind === "excluded") return theme.excluded;
  return theme.bloodline;
}

function connectorColor(kind: "normal" | "former" | "adopted" | "step", context: RenderContext): string {
  if (kind === "former") return context.theme.formerSpouse;
  if (kind === "adopted") return context.theme.adopted;
  if (kind === "step") return context.theme.step;
  return context.theme.connector;
}

function tagColor(tag: string, theme: FamilyTreeTheme): string {
  if (tag === "v") return theme.heir;
  if (tag.startsWith("m")) return theme.inheritance;
  if (tag === "x" || tag === "red") return theme.excluded;
  return theme.mutedText;
}

function dash(kind: "normal" | "former" | "adopted" | "step"): string {
  return kind === "normal" ? "" : ' stroke-dasharray="6 5"';
}

function formatDates(person?: FamilyTreePerson): string | undefined {
  if (!person?.birthDate && !person?.deathDate) return undefined;
  if (person.birthDate && person.deathDate) return `${person.birthDate} – ${person.deathDate}`;
  return person.birthDate ?? `† ${person.deathDate}`;
}

function sumWidths(items: Size[], gap: number): number {
  return items.length ? items.reduce((total, item) => total + item.width, 0) + (items.length - 1) * gap : 0;
}

function issue(line: number, column: number, severity: FamilyTreeIssueSeverity, code: string, message: string): FamilyTreeIssue {
  return { line, column, severity, code, message };
}

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function slug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "person";
}

function truncate(value: string, maxLength: number): string {
  return value.length <= maxLength ? value : `${value.slice(0, Math.max(0, maxLength - 1))}…`;
}

function isSpace(value: string | undefined): boolean {
  return value === undefined || /\s/.test(value);
}

function text(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function attr(value: string): string {
  return text(value).replace(/"/g, "&quot;");
}

function round(value: number): string {
  return Number(value.toFixed(2)).toString();
}

function tint(color: string, amount: number): string {
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) return color;
  const red = Number.parseInt(color.slice(1, 3), 16);
  const green = Number.parseInt(color.slice(3, 5), 16);
  const blue = Number.parseInt(color.slice(5, 7), 16);
  return `#${[red, green, blue]
    .map((channel) => Math.round(channel + (255 - channel) * amount).toString(16).padStart(2, "0"))
    .join("")}`;
}
