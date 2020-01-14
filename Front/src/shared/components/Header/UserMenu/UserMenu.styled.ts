/* tslint:disable */
import styled from "@emotion/styled";

export default styled.div`
  display: flex;
  color: ${(props: any) => props.theme.colors.primaryBody};
  height: 30px;

  .user-menu__link {
    text-decoration: none;

    .user-menu__avatar {
      margin-right: 10px;
      align-self: flex-end;
    }
  }

  .user-menu__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .user-menu__name {
    font-size: ${(props: any) => props.theme.fontSize.body};
    line-height: 0.8;
  }

  .user-menu__role {
    font-size: ${(props: any) => props.theme.fontSize.small};
    color: ${(props: any) => props.theme.colors.secondaryBody};
  }
`;
