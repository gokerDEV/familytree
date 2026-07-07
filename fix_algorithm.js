const fs = require("node:fs");

let code = fs.readFileSync("src/lib/familytree.ts", "utf8");

// We need to rewrite measureAndLayoutBlock.
const newMeasureAndLayoutBlock = `function measureAndLayoutBlock(block: LayoutPersonBlock, context: RenderContext) {
  const cardW = context.options.cardWidth;
  const spouseGap = context.options.partnerGap;
  const siblingGap = context.options.partnerGap * 2;

  // 1. Recursively measure all children
  for (const union of block.unions) {
    for (const child of union.children) {
      measureAndLayoutBlock(child, context);
    }
  }

  // 2. Pack children within each union and center them relative to 0
  for (const union of block.unions) {
    if (union.children.length > 0) {
      packSiblings(union.children, siblingGap);

      let packedLeft = Infinity;
      let packedRight = -Infinity;

      for (const child of union.children) {
        const childLeft = Math.min(...Array.from(child.leftContour.values()));
        const childRight = Math.max(...Array.from(child.rightContour.values()));
        if (childLeft < packedLeft) packedLeft = childLeft;
        if (childRight > packedRight) packedRight = childRight;
      }

      const packedWidth = packedRight - packedLeft;
      // Center them around 0 initially
      const shiftX = - (packedWidth / 2) - packedLeft;

      for (const child of union.children) {
        shiftBlock(child, shiftX);
      }
    }
  }

  // 3. Position spouses and their unions sequentially to avoid overlapping subtrees
  const aggregateLeft = new Map<number, number>();
  const aggregateRight = new Map<number, number>();

  // Add the anchor card to the aggregate contours
  aggregateLeft.set(block.depth, 0);
  aggregateRight.set(block.depth, cardW);

  let currentLocalX = cardW + spouseGap;

  for (let i = 0; i < block.spouses.length; i++) {
    const spouse = block.spouses[i];
    const union = block.unions.find(u => u.spousePersonId === spouse.personId);

    let requiredShift = 0;

    if (union && union.children.length > 0) {
      // Calculate how much we need to shift the union's children to avoid the aggregateRight
      for (const child of union.children) {
        for (const [depth, aggRight] of aggregateRight.entries()) {
          if (child.leftContour.has(depth)) {
            // The child is currently centered around 0.
            // If we place the wedding at currentLocalX + cardW/2, the child's absolute left will be:
            const proposedWeddingX = currentLocalX + cardW / 2;
            const childLeft = child.leftContour.get(depth)! + proposedWeddingX;
            const required = aggRight + siblingGap - childLeft;
            if (required > requiredShift) {
              requiredShift = required;
            }
          }
        }
      }
    }

    // Apply the required shift to space out the spouse
    currentLocalX += requiredShift;

    spouse.localX = currentLocalX;
    spouse.centerX = currentLocalX + cardW / 2;

    if (union) {
      union.weddingLocalX = spouse.centerX;
      // Shift children to their final position under the wedding node
      for (const child of union.children) {
        shiftBlock(child, union.weddingLocalX);
        mergeContours(aggregateLeft, aggregateRight, child.leftContour, child.rightContour, 0);
      }
    }

    // Add this spouse to the aggregate contours
    const shiftedSpouseRight = currentLocalX + cardW;
    if (!aggregateRight.has(block.depth) || shiftedSpouseRight > aggregateRight.get(block.depth)!) {
      aggregateRight.set(block.depth, shiftedSpouseRight);
    }
    
    currentLocalX += cardW + spouseGap;
  }

  // 4. Calculate block boundaries
  let minLocalX = 0;
  let maxLocalX = cardW;

  if (block.spouses.length > 0) {
    const lastSpouse = block.spouses[block.spouses.length - 1];
    maxLocalX = Math.max(maxLocalX, lastSpouse.localX + cardW);
  }

  for (const union of block.unions) {
    for (const child of union.children) {
      const childMin = Math.min(...Array.from(child.leftContour.values()));
      const childMax = Math.max(...Array.from(child.rightContour.values()));
      if (childMin < minLocalX) minLocalX = childMin;
      if (childMax > maxLocalX) maxLocalX = childMax;
    }
  }

  // 5. Shift everything so minX is 0
  const shiftToZero = -minLocalX;
  
  block.anchor.localX += shiftToZero;
  block.anchor.centerX += shiftToZero;
  for (const spouse of block.spouses) {
    spouse.localX += shiftToZero;
    spouse.centerX += shiftToZero;
  }
  for (const union of block.unions) {
    union.weddingLocalX += shiftToZero;
    union.childGroupLeft += shiftToZero;
    for (const child of union.children) {
      shiftBlock(child, shiftToZero);
    }
  }

  block.width = maxLocalX - minLocalX;

  // 6. Update the block's contours
  block.leftContour.set(block.depth, block.anchor.localX);
  block.rightContour.set(block.depth, block.spouses.length > 0 ? block.spouses[block.spouses.length - 1].localX + cardW : block.anchor.localX + cardW);

  for (const union of block.unions) {
    for (const child of union.children) {
      mergeContours(block.leftContour, block.rightContour, child.leftContour, child.rightContour, 0);
    }
  }
}`;

const start = code.indexOf("function measureAndLayoutBlock(");
const end = code.indexOf("function resolveAbsoluteCoordinates(");

if (start !== -1 && end !== -1) {
  code =
    code.substring(0, start) +
    newMeasureAndLayoutBlock +
    "\n\n" +
    code.substring(end);
  fs.writeFileSync("src/lib/familytree.ts", code);
  console.log("Algorithm patched successfully.");
} else {
  console.error("Could not find the function to patch.");
}
