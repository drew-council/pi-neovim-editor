import { describe, expect, test } from "bun:test";
import { toNeovimInput } from "../src/input";

describe("embedded Neovim key translation", () => {
  test("translates backspace variants to key notation", () => {
    expect(toNeovimInput("\x7f")).toBe("<BS>");
    expect(toNeovimInput("\x1b[127;2u")).toBe("<S-BS>");
    expect(toNeovimInput("\x1b[127;2:1u")).toBe("<S-BS>");
    expect(toNeovimInput("\x1b[127;5u")).toBe("<C-BS>");
  });

  test("keeps shifted kitty printable keys as text", () => {
    expect(toNeovimInput("\x1b[97;2u")).toBe("a");
    expect(toNeovimInput("\x1b[60;2u")).toBe("<LT>");
  });
});
