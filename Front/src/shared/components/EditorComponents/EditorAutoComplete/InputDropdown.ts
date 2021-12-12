/* tslint:disable */
import React from "react";
import Dropdown from ".";
import { render, fireEvent, cleanup } from "react-testing-library";
import { Simulate } from "react-dom/test-utils";
/*
const testData = ['test1', 'test2', 'test3', 'test4', 'qwerty'];

describe('Function tests', () => {
  afterAll(cleanup);

  it("Simulate user's input", () => {
    const object = render(<Dropdown inputData={testData} />);
    const input = object.getByTestId('input') as HTMLInputElement;

    Simulate.click(input);
    expect(object).toMatchSnapshot();

    input.value = '1';
    Simulate.change(input);
    expect(object).toMatchSnapshot();

    const selectedOption = object.getByTestId('test1') as HTMLInputElement;
    Simulate.click(selectedOption);
    expect(object).toMatchSnapshot();
  });
});*/
