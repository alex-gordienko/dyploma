/* tslint:disable */
import React from "react";
import { TabElement } from "./Label.styled";
import { LabelBlock } from "../../EditorComponents/EditorComponents.styled";
import { ButtonBlock } from "../../EditorComponents/EditorComponents.styled";
import { NavLink } from "react-router-dom";

interface ILabelProps {
  selectedCaption: number;
  onSelect: (mode: "search" | "friends" | "blocked" | "invite") => void;
}

class Label extends React.PureComponent<ILabelProps> {
  constructor(props: Readonly<ILabelProps>) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  private onSelect(mode: "search" | "friends" | "blocked" | "invite") {
    this.props.onSelect(mode);
  }

  public render() {
    return (
      <LabelBlock>
        <TabElement>
          <input
            checked={this.props.selectedCaption === 1 ? true : false}
            onClick={() => this.onSelect("search")}
            type="radio"
            id="tab1"
          />
          <label htmlFor="tab1">Search</label>
          <input
            checked={this.props.selectedCaption === 2 ? true : false}
            onClick={() => this.onSelect("friends")}
            type="radio"
            id="tab2"
          />
          <label htmlFor="tab2">Friends</label>
          <input
            checked={this.props.selectedCaption === 3 ? true : false}
            onClick={() => this.onSelect("invite")}
            type="radio"
            id="tab3"
          />
          <label htmlFor="tab3">Invite</label>
          <input
            checked={this.props.selectedCaption === 4 ? true : false}
            onClick={() => this.onSelect("blocked")}
            type="radio"
            id="tab4"
          />
          <label htmlFor="tab4">Blocked</label>
        </TabElement>
      </LabelBlock>
    );
  }
}

export default Label;
