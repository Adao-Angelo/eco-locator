import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MaterialsDistribution from "./materials-distribution";

describe("MaterialsDistribution", () => {
  it("renders material labels and percentages", () => {
    const materialCounts = { plastic: 1, glass: 1 };
    const totalPoints = 2;
    const { getByText, getAllByText } = render(
      <MaterialsDistribution
        materialCounts={materialCounts}
        totalPoints={totalPoints}
      />
    );

    expect(getByText("plastic")).toBeTruthy();
    expect(getByText("glass")).toBeTruthy();

    // there can be multiple identical percentage labels (one per material),
    // so assert at least one match exists
    const matches = getAllByText("1 (50.0%)");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});
