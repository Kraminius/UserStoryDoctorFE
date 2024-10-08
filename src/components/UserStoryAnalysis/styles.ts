import {Row, Tabs} from "antd";
import styled from "styled-components";

export const ContentSection = styled("section")`
  position: relative;
  padding: 10rem 0 8rem;

  @media only screen and (max-width: 1024px) {
    padding: 4rem 0 4rem;
  }
`;

export const Content = styled("p")`
  margin: 1.5rem 0 2rem 0;
`;

export const StyledTabs = styled(Tabs)`
  .ant-tabs-nav .ant-tabs-tab {
    color: #18216D; // Set the color of the tab labels
  }

  .ant-tabs-nav .ant-tabs-tab:hover {
    color: #18216D; // Set the color on hover
  }

  .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #18216D; // Set the color of the active tab label
  }

  .ant-tabs-nav .ant-tabs-tab .ant-tabs-tab-btn {
    color: #18216D;
  }
`;




export const Link = styled("a")`
    color: #18216d;
    max-width: fit-content;
    border-bottom: 1px solid #18216d;
    cursor: pointer;
    font-size: 1.25rem;
    transition: all 0.3s ease-in-out;
    text-decoration: none; /* Remove default underline if desired */

    &:hover {
        border-bottom: 1px solid rgb(255, 130, 92);
        color: rgb(255, 130, 92);
        text-decoration: none; /* Maintain no underline on hover */
    }
`;
