Aşağıdaki planı doğrudan Antigravity’ye görev listesi gibi verebiliriz. Mevcut repo Next 16.2.10, React 19.2.4 ve Tailwind 4 kullanıyor; buna uygun ilerleyelim.

## Uygulama planı

### 1. Paketler ve shadcn componentleri

Önce sadece gereken shadcn componentlerini CLI ile çekelim; dosyaları elle yazmayalım, componentlerin içine de dokunmayalım.

```bash
bunx shadcn@latest add button
bunx shadcn@latest add sheet
bunx shadcn@latest add resizable
bunx shadcn@latest add card
bunx shadcn@latest add label
bunx shadcn@latest add separator
bunx shadcn@latest add scroll-area
```

Resizable için `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle` composition kullanılacak; shadcn dokümanı da bu yapıyı öneriyor. ([Shadcn UI][1])

Soldan açılan “drawer” için shadcn tarafında teknik olarak `Sheet` kullanalım. `SheetContent` component’i `side="left"` destekliyor; bu bizim istediğimiz sol drawer davranışına uygun. ([Shadcn UI][2])

CodeMirror için:

```bash
bun add @uiw/react-codemirror @codemirror/lang-markdown @codemirror/theme-one-dark
```

Ama `theme-one-dark` kullanmayalım; shadcn default renklerine sadık kalmak için editor’u light/default bırakmak daha doğru. Gerekirse sadece temel extension ve minimal height verelim.

---

### 2. Dosya yapısı

Önerilen yapı:

```text
src/
  app/
    page.tsx
  components/
    family-tree-editor.tsx
    family-tree-header.tsx
    family-tree-how-to-sheet.tsx
    family-tree-preview.tsx
    family-tree-theme-config.tsx
  lib/
    familytree.ts
```

`src/lib/familytree.ts` mevcut parser/render çekirdeği olarak kalacak. UI tarafı bu dosyayı sadece consume edecek.

---

### 3. Ana sayfa layout

`src/app/page.tsx` server component olarak sade kalsın:

```tsx
import { FamilyTreeEditor } from "@/components/family-tree-editor";

export default function Home() {
  return <FamilyTreeEditor />;
}
```

Asıl state, localStorage, CodeMirror ve live preview client component içinde olacak.

---

### 4. Header

`family-tree-header.tsx`

İçerik:

```text
sol: family tree
sağ:
  - GitHub linki
  - How to button
```

Kurallar:

* shadcn `Button` kullanılacak.
* Git linki plain `<a>` veya shadcn `buttonVariants` ile verilebilir.
* Header sticky olabilir ama custom tema yok.
* Renkler Tailwind/shadcn tokenlarıyla: `bg-background`, `border-border`, `text-foreground`, `text-muted-foreground`.

---

### 5. How to drawer / sheet

`family-tree-how-to-sheet.tsx`

Kullanılacak yapı:

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">How to</Button>
  </SheetTrigger>
  <SheetContent side="left">
    ...
  </SheetContent>
</Sheet>
```

İçerik:

* notasyon tablosu
* örnek mini şablon
* ilişki renkleri
* color picker alanı

Notasyon açıklaması:

```text
+     evlilik / eş
x+    boşanmış eski eş
a+    evlatlık bağı
~     üvey / soy dışı bağlantı
@id   aynı kişiyi tekrar bağlama
"..." nickname
(...) doğum / ölüm
{...} info
[...] statü / miras / varis
```

Renk konfigürasyonu burada olacak. Drawer soldan açıldığı için sağdaki preview görünmeye devam eder; renk değişiklikleri preview’da anlık görülecek.

---

### 6. Renk config modeli

`familytree.ts` içinde zaten `theme` partial olarak verilebiliyor. UI tarafında sadece border renklerini etkileyen alanları expose edelim.

LocalStorage key:

```ts
const FAMILY_TREE_THEME_STORAGE_KEY = "familytree.theme.v1";
```

Expose edilecek renkler:

```ts
type FamilyTreeThemeConfig = {
  bloodline: string;
  spouse: string;
  formerSpouse: string;
  adopted: string;
  step: string;
  heir: string;
  inheritance: string;
  excluded: string;
};
```

Not: `background`, `text`, `mutedText`, `cardBackground` gibi shadcn görünümünü bozabilecek renkleri kullanıcıya açmayalım. Kullanıcı sadece ilişki/kart border rengini değiştirsin.

Color picker için native input yeterli:

```tsx
<input type="color" />
```

Shadcn color-picker yoksa ekstra custom component yazmayalım. `Label`, `Card`, `Button` composition ile saralım.

---

### 7. Editor paneli

`family-tree-editor.tsx`

State:

```ts
const [source, setSource] = useState(DEFAULT_FAMILY_TREE_EXAMPLE);
const [theme, setTheme] = useState<FamilyTreeThemeConfig>(...);
```

CodeMirror:

```tsx
<CodeMirror
  value={source}
  height="100%"
  extensions={[markdown()]}
  onChange={setSource}
/>
```

Editor container:

* `h-full`
* `overflow-hidden`
* `border`
* `bg-background`

Syntax highlight custom etmeyelim. Gerekirse sadece CodeMirror’ın kendi temel görünümü kalsın.

---

### 8. Preview paneli

`family-tree-preview.tsx`

Her source/theme değişiminde:

```ts
const { result, svg } = useMemo(
  () =>
    parseAndRenderFamilyTreeSvg(source, {
      theme,
      showLegend: true,
    }),
  [source, theme],
);
```

Render:

```tsx
<div dangerouslySetInnerHTML={{ __html: svg }} />
```

Hata varsa preview üstünde küçük bir panel:

```text
Line 12: spouse-without-person — A spouse relation must be nested under a person.
```

Kurallar:

* parse error olsa bile SVG render edilebilir; ama issue listesi görünür.
* `result.ok === false` ise hata alanı `border-destructive` veya shadcn default destructive tokenlarıyla gösterilir.
* SVG container scrollable olmalı.

---

### 9. Resizable editor / preview layout

Ana gövde:

```tsx
<ResizablePanelGroup orientation="horizontal">
  <ResizablePanel defaultSize={42} minSize={25}>
    editor
  </ResizablePanel>

  <ResizableHandle withHandle />

  <ResizablePanel defaultSize={58} minSize={35}>
    preview
  </ResizablePanel>
</ResizablePanelGroup>
```

shadcn dokümanında horizontal kullanım bu composition ile veriliyor; `ResizableHandle` araya yerleşiyor. ([Shadcn UI][1])

---

### 10. LocalStorage davranışı

İlk yükleme:

```ts
useEffect(() => {
  const stored = localStorage.getItem(FAMILY_TREE_THEME_STORAGE_KEY);
  if (stored) setTheme(JSON.parse(stored));
}, []);
```

Değişiklikte kaydetme:

```ts
useEffect(() => {
  localStorage.setItem(FAMILY_TREE_THEME_STORAGE_KEY, JSON.stringify(theme));
}, [theme]);
```

Reset butonu:

```text
Reset colors
```

Bu buton theme’i `DEFAULT_FAMILY_TREE_THEME` içinden expose edilen ilişki renklerine döndürür.

---

## Antigravity’ye verilecek uygulama sırası

```text
1. Install required packages and shadcn components using bunx/bun.
2. Keep shadcn generated component files untouched.
3. Replace src/app/page.tsx with a minimal page that renders FamilyTreeEditor.
4. Create FamilyTreeEditor as the main client component.
5. Add header with title, GitHub link, and How to sheet trigger.
6. Add left Sheet for notation guide and color config.
7. Add CodeMirror editor on the left panel.
8. Add SVG preview on the right panel using parseAndRenderFamilyTreeSvg.
9. Use shadcn ResizablePanelGroup between editor and preview.
10. Persist only border/theme relation colors to localStorage.
11. Run bun run lint and bun run build.
```

## Kabul kriterleri

```text
- App tek sayfa çalışır.
- Sol panelde CodeMirror vardır.
- Sağ panelde live SVG preview vardır.
- Editor/preview arası resizable’dır.
- Header solda “family tree”, sağda GitHub linki ve How to butonu içerir.
- How to soldan açılan Sheet olarak çalışır.
- Sheet içinde notasyon açıklaması ve ilişki renkleri görünür.
- Renk seçimleri sadece SVG border/edge renklerini değiştirir.
- Renk config localStorage’a kaydedilir.
- shadcn default tema dosyalarına custom müdahale yapılmaz.
- shadcn componentleri elle yazılmaz, CLI ile eklenir.
- `src/lib/familytree.ts` UI bağımlılığı almaz.
```

Bunu uygularken ilk PR’daki `src/lib/familytree.ts` çekirdeğini UI’dan ayırmaya devam edelim; editor/preview katmanı sadece composition olsun.

[1]: https://ui.shadcn.com/docs/components/resizable "Resizable - shadcn/ui"
[2]: https://ui.shadcn.com/docs/components/sheet "Sheet - shadcn/ui"
