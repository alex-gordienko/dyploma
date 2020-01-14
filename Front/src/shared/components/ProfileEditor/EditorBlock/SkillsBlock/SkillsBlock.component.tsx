/* tslint:disable */
import React from "react";
import { ITheme } from "../../../../../styles/variables";
import ChipsDropdown from "../../../ChipsDropdown";
import StyledSkillsBlock from "./SkillsBlock.styled";
import { SubHeader } from "../../ProfileEditor.styled";

interface ISkillsBlock {
  skillsList: string[];
  theme: ITheme;
}

class SkillsBlock extends React.PureComponent<ISkillsBlock> {
  constructor(props: Readonly<ISkillsBlock>) {
    super(props);
  }
  /*
    componentWillMount(){
        window.onload = function(){
            const b1 = document.getElementById("skillsBlock")!;//блок перед которым ставим
            const b2 = document.getElementById("chipsList")!;//блок который передвигаем
            b1.parentNode!.insertBefore(b2, b1);
        }
    }
*/

  public render() {
    return (
      <div>
        <SubHeader>Technical Proficiencies</SubHeader>
        <StyledSkillsBlock>
          <div className="label">Add skill:</div>
          <div className="element">
            <ChipsDropdown
              inputData={this.props.skillsList}
              theme={this.props.theme}
            />
          </div>
        </StyledSkillsBlock>
      </div>
    );
  }
}

export default SkillsBlock;
