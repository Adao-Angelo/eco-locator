import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AddPointModal from "./add-point-modal";

// Very basic smoke test to ensure component renders
describe("AddPointModal", () => {
  it("renders without crashing", () => {
    const { container } = render(<AddPointModal />);
    expect(container).toBeTruthy();
  });
});
