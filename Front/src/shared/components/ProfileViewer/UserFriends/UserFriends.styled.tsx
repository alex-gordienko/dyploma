/* tslint:disable */
import { styled } from "../../../../styles/styled";

export const StyledUserFriendsBlock = styled.div`
  max-width: inherit;
  margin: 10px 20px 0px 50px;
  padding: 2px;
  display: inline-flex;
  box-shadow: 0px 0px 10px 0px ${props => props.theme.colors.primaryBody} inset;
`;

export const Friend = styled.div`
  text-align: center;
  padding: 5px 10px 5px 10px;
  display: grid;
  border: 1px solid gray;
  cursor: pointer;
  &:hover {
    transition: 1s;
    background: ${props => props.theme.colors.secondaryHover};
  }
  .avatar {
    height: 50px;
    width: 50px;
    border-radius: 25px;
  }
  .username {
    font-family: ${props => props.theme.fontFamily.body};
    font-size: ${props => props.theme.fontSize.body};
    color: ${props => props.theme.colors.primaryBody};
    text-decoration: none;
  }
`;
