/* tslint:disable */
import { styled } from "../../../../styles/styled";

export default styled.div`
  width: 56%;
  max-height: inherit;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  font-family: ${(props: any) => props.theme.fontFamily.body};
`;

export const Avatar = styled.div`
  display: flex;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  > img {
    border-radius: 25px;
    width: 100%;
    height: 100%;
    margin: 0px auto 0px auto;
  }
`;

export const Chatname = styled.div`
  margin-left: 10px;
  .type {
    font-size: ${(props: any) => props.theme.fontSize.small};
  }
  .member-count {
    font-size: ${(props: any) => props.theme.fontSize.small};
  }
`;

export const MessageContainer = styled.div<{ myMessage: boolean }>`
  width: 90%;
  background: transparent;

  font-family: ${(props: any) => props.theme.fontFamily.body};
  text-align: ${props => (props.myMessage ? "right" : "left")};
  border-${props => (props.myMessage ? "right" : "left")}: 1px solid red;
  padding-${props => (props.myMessage ? "right" : "left")}: 5px;
  margin-${props => (props.myMessage ? "right" : "left")}: 5px;
  margin-${props => (props.myMessage ? "left" : "right")}: auto;
  margin-bottom: 6px;
  &:hover{
    background: ${props => props.theme.colors.secondaryHover};
    box-shadow: 0 0 3px rgba(0,0,0,0.5);
    transition: .3s
  }
`;

export const MessageContent = styled.div<{ myMessage: boolean }>`
  margin-${props => (props.myMessage ? "left" : "right")}: auto;
  max-width: 70%;
  width: max-content;
  text-align: ${props => (props.myMessage ? "right" : "left")};
`;

export const MessageAuthor = styled.div<{ Rating: number }>`
  display: inline-flex;
  color: hsl(${props => props.Rating}, 100%, 50%);

  .avatar {
    display: flex;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    > img {
      border-radius: 15px;
      width: 100%;
      height: 100%;
      margin: 0px auto 0px auto;
    }
  }
`;

export const MessageDate = styled.div`
  width: max-content;
  margin: 0px auto;
  background: lightgray;
  border-radius: 5px;
  padding: 5px;
  font-family: ${(props: any) => props.theme.fontFamily.body};
  text-align: center;
  font-size: ${(props: any) => props.theme.fontSize.small};
`;

export const MessageTime = styled.div`
  font-size: ${(props: any) => props.theme.fontSize.small};
`;

export const MessangerHeader = styled.div`
  margin-left: 10px;
  display: inline-flex;
  width: 100%;
  .clear {
    color: ${props => props.theme.colors.button.hoverTextColor};
    padding: 0;
    margin-left: 10px;
    cursor: pointer;
    background: transparent;
    border: none;
    outline: none;
  }
`;

export const MessengerContentBlock = styled.div`
  padding-top: 5px;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.5),
    inset -2px -2px 5px rgba(0, 0, 0, 0.5);
  height: 100%;
  max-height: 58vh;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 0px;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const MessengerFooterBlock = styled.div`
  width: 100%;
`;
