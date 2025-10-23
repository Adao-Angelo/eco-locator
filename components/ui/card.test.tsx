import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card component", () => {
  it("renders children", () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(getByText("Title")).toBeTruthy();
    expect(getByText("Content")).toBeTruthy();
    expect(getByText("Footer")).toBeTruthy();
  });

  it("accepts className on sub components", () => {
    const { container } = render(
      <Card>
        <CardHeader className="test-header" />
        <CardContent className="test-content" />
      </Card>
    );

    expect(container.querySelector(".test-header")).toBeTruthy();
    expect(container.querySelector(".test-content")).toBeTruthy();
  });

  it("renders CardAction and CardDescription", () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardDescription>Description</CardDescription>
      </Card>
    );

    expect(getByText("Action")).toBeTruthy();
    expect(getByText("Description")).toBeTruthy();
  });
});
