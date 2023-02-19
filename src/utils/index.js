export const shuffleNumbers = (matchesLimit) => {
  const numbers = [...Array(matchesLimit).keys()]

  return [...numbers, ...numbers].sort(() => Math.random() - 0.5);
}

export const setStyles = (grid, width, height, columns, rows) => {
  return grid.style.cssText = `
    width: ${width}px;
    height: ${height}px;
    grid-template-columns: repeat(${columns}, auto);
    grid-template-rows: repeat(${rows}, auto);
  `;
}
