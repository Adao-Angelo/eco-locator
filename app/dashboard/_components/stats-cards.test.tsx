import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatsCards from "./stats-cards";

describe("StatsCards", () => {
  it("renders four stat items with titles and values", () => {
    const stats = { total: 10, active: 6, inactive: 4, materialTypes: 5 };
    const { getByText } = render(<StatsCards stats={stats} />);

    expect(getByText("Total Points")).toBeTruthy();
    expect(getByText("Active Points")).toBeTruthy();
    expect(getByText("Material Types")).toBeTruthy();
    expect(getByText("Inactive Points")).toBeTruthy();

    expect(getByText("10")).toBeTruthy();
    expect(getByText("6")).toBeTruthy();
    expect(getByText("5")).toBeTruthy();
    expect(getByText("4")).toBeTruthy();
  });
});
