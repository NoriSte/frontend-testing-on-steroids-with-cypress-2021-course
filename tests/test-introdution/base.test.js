const sum = (a, b) => a + b;
const subtract = (a, b) => a - b;

test("Should sum", () => {
  expect(sum(3, 7)).toEqual(10);
});
test("Should subtract", () => {
  expect(subtract(7, 3)).toEqual(4);
});
