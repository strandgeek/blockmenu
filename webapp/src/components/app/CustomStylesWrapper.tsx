import styled from "styled-components";

export const CustomStylesWrapper = styled.div<{ primaryColor?: string }>`
  .menu > li {
    :where(li:not(.menu-title):not(:empty)) > :where(*:not(ul):active) {
      background-color: ${(props) => props.primaryColor};
      color: white;
      .text-xs {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  .tabs-boxed .tab-active:not(.tab-disabled):not([disabled]) {
    background-color: ${(props) => props.primaryColor};
  }
  .btn:disabled {
    color: rgba(255, 255, 255, 0.5);
    opacity: 0.5;
  }
  .btn-primary {
    background-color: ${(props) => props.primaryColor};
    border-color: ${(props) => props.primaryColor};
  }
  .badge-primary {
    background-color: ${(props) => props.primaryColor};
    border-color: ${(props) => props.primaryColor};
  }
`;
