Kodda doğru yöne gidilmiş: `LayoutPersonBlock`, `LayoutUnionBlock`, `leftContour/rightContour`, `packSiblings()` zaten “subtree collision” çözümü için uygun iskelet. Ama mevcut yaklaşım **garanti kusursuz** değil; özellikle çok eşlilik / boşanma / geniş çocuk gruplarında eşleri sağa dizip çocukları sonra kaydırmak kırılgan olur. 

Bence algoritma şöyle kurulmalı:

## 1. Temel birim: `FamilyBlock`

Her kişi tek başına çizilmemeli. Render ölçümünde ana birim şu olmalı:

```ts
FamilyBlock = {
  anchorPerson,
  spouseSlots[],
  unionSlots[],
  childrenBlocks[],
  width,
  height,
  anchorCenterX,
  contours
}
```

Yani **kişi + eşler + evlilik node’ları + çocuk subtree’leri** tek ölçülebilir blok gibi davranmalı.

## 2. İki aşamalı layout

### Aşama 1 — bottom-up measure

En alttan yukarı doğru:

1. Çocukların block genişliklerini hesapla.
2. Aynı union altındaki çocukları `siblingGap = 2n` ile contour çakıştırmadan paketle.
3. Eş/evlilik satırını hesapla.
4. Parent block genişliği:

```ts
block.width = max(coupleRowWidth, childrenGroupWidth)
```

5. `anchorCenterX` sabitlenir.

Bu aşamada SVG koordinatı yok. Sadece local ölçüm var.

### Aşama 2 — top-down placement

Root’tan aşağı inerken:

```ts
absoluteX = parentAbsoluteX + localX
absoluteY = depth * levelHeight
```

Her şey ölçülmüş olduğu için yerleştirme sadece koordinat çözme olur.

## 3. Çakışmayı bitiren ana kural: contour packing

Sibling/subtree dizme işi sadece şu kuralla yapılmalı:

```ts
requiredShift = max(
  previousRightContour[depth] + gap - nextLeftContour[depth]
)
```

Tüm ortak depth’ler gezilir. En büyük required shift uygulanır.

Bu doğru uygulanırsa kartların üst üste binmesi matematiksel olarak engellenir.

## 4. Eş yerleşimi ayrı politika olmalı

Şu an eşler pratikte anchor kişinin sağına diziliyor. Bu aile ağacı için yeterli değil.

Önerilen kural:

```ts
current spouse: anchor'a n mesafe
former spouse: anchor'a daha yakın ama dış tarafa alınabilir
sibling: 2n mesafe
```

Örnek politika:

```ts
current spouse  -> sağ taraf, n
former spouse   -> sol/sağ dış slot, n veya 1.5n
multiple former -> anchor'a yakınlık sırasına göre dışa doğru
```

Yani `union.kind === "former"` sadece çizgi stilini değil, **slot pozisyonunu da** etkilemeli.

## 5. Wedding / union node merkezi

Mevcut kodda union node çoğunlukla spouse center’a yaslanıyor. Daha doğru model:

```ts
current union center = midpoint(anchorCenter, spouseCenter)
former union center = lerp(anchorCenter, spouseCenter, 0.65)
```

Boşanmış eşte tam orta değil, anchor’a biraz daha yakın olabilir:

```ts
weddingX = anchorCenter * 0.65 + spouseCenter * 0.35
```

Ya da tersi ilişki yönüne göre ayarlanır.

## 6. Basit veri akışı

Render algoritması şöyle olmalı:

```ts
buildTree()
measurePersonBlock(node)
  measure children
  pack children by contour
  layout spouse slots
  align child groups under union node
  compute contours

pack roots by contour

placeAbsolute(root)
renderSvg()
```

## 7. Mevcut kodda direkt değiştirilecek yerler

En kritik yerler:

```ts
measureAndLayoutBlock()
packSiblings()
buildLayoutBlock()
resolveAbsoluteCoordinates()
```

Bunlar korunabilir ama mantık şöyle netleşmeli:

* `packSiblings()` genel `packBlocks()` yapılmalı.
* Her block kendi `leftContour/rightContour` değerini eksiksiz üretmeli.
* Spouse row da contour’a dahil edilmeli.
* Union çocukları önce kendi içinde paketlenmeli, sonra union center altına hizalanmalı.
* Parent block, çocuklara göre büyüyebilmeli.
* Sonradan “üst üste geldi mi?” düzeltmesi yapılmamalı; layout baştan çakışmasız hesaplanmalı.

## Kısa karar

Bence en temiz çözüm:

**Reingold–Tilford / Walker tidy tree mantığını aile ağacına uyarlamak.**

Ama normal tree node yerine:

```ts
Person + SpouseSlots + UnionSlots + ChildrenGroup
```

şeklinde compound node kullanılmalı.

Bu şekilde:

* kardeşler arası `2n`,
* eşler arası `n`,
* eski eşlerin anchor’a yakın/dış slot davranışı,
* evlatlık/step çocukların çizgi farkı,
* çok geniş alt ağaçların çakışmaması

tek algoritma içinde kontrol edilir.
