function matchPosition(depth, level, j, matchWidth, playerHeight) {
  const totalMatches = 2 ** (depth - 1 - level);
  const isOnLeft = j < totalMatches / 2 ? -1 : 1;
  const x = isOnLeft * (depth - level - 1) * matchWidth;
  let y = level < depth - 1 ? (
    (j - (isOnLeft + 1) / 2 * totalMatches / 2) // recenter when you go to the matches on the right
    - (2 ** (depth - 2 - level) - 1) / 2) * 2 ** (level + 1) * playerHeight * 1.8 // recenter and rescale according to the level
    : 0;
  if (level === depth-1) y += -2*playerHeight;
  return { x, y }
}

export function nodesGenerator(depth, matches) {
  let nodes = [];
  for (let level = 0; level < depth; level++) {
    const playerHeight = 40;
    const matchWidth = 250;

    for (let j = 2 ** (depth - 1 - level) - 1; j >= 0; j += -1) {
      const position = matchPosition(depth, level, j, matchWidth, playerHeight)
      const id = j + 2 ** (depth - 1 - level) - 1;
      let newMatch = {
        id: `${id}`,
        type: "matchNode",
        position,

        data: { id: `${id}`, dlevel: depth - 1 - level, j }, // j is the match index inside the level
      };
      nodes = [newMatch, ...nodes];
    }
  }
  return nodes;
}

export function edgesGenerator(depth, matches) {
  let edges = [];
  for (let level = 0; level < depth - 1; level++) {
    const totalMatchesLevel = 2 ** (depth - 1 - level);
    for (let j = 0; j < totalMatchesLevel; j++) {

      const isOnLeft = j < totalMatchesLevel / 2;
      let left_edge = `${j + 2 ** (depth - 1 - level) - 1}`;
      let right_edge = `${Math.round((j - 1) / 2) + 2 ** (depth - 1 - level - 1) - 1}`;
      if (!isOnLeft) {
        [left_edge, right_edge] = [right_edge, left_edge];
      }
      let newEdge = {
        id: `${j + 2 ** (depth - 1 - level) - 1}`,
        source: left_edge,
        target: right_edge,
        type: 'smoothstep',
        style: 'stroke: black; stroke-width: 2;'
      }
      edges = [...edges, newEdge]
    }
  }
  return edges
}

export function seedingGenerator(depth) {
  if (depth <= 1) return [0];

  const half1 = seedingGenerator(depth - 1);
  const half2 = half1.map(player => 2 ** (depth - 1) - player - 1);
  const seeding = [];

  for (let i = 0; i < half1.length; i++) {
    seeding.push(half1[i], half2[i]);
  }

  return seeding;
}