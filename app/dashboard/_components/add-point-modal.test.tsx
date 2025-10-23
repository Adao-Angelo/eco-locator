import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AddPointModal from "./add-point-modal";

describe("AddPointModal", () => {
  it("renders without crashing", () => {
    const { container } = render(<AddPointModal />);
    expect(container).toBeTruthy();
  });
});
