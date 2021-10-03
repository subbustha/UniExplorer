import React from "react";
import renderer from "react-test-renderer";

import LogoPage from "../logo.page";

describe("<LogoPage />", () => {
  it("has 3 children child", () => {
    const tree = renderer.create(<LogoPage />).toJSON();
    console.log(tree);
    expect(tree.children.length).toBe(3);
  });
});