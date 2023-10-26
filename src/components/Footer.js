import React from "react";
import styled from "styled-components";

import { TwitterOutlined, GithubOutlined } from "@ant-design/icons";

const Footer = () => {
  return (
    <Wrapper>
      <div className="nav-footer">
        <a
          href={"https://twitter.com/ForkedFinance_"}
          target="_blank"
          className="social"
        >
          <TwitterOutlined style={{ fontSize: "30px", color: "#0055cb" }} />
        </a>

        <a
          href={"https://github.com/yury-ff"}
          target="_blank"
          className="social"
        >
          <GithubOutlined style={{ fontSize: "30px", color: "#0055cb" }} />
        </a>
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.nav`
  height: 3rem;
  display: flex;
  border-top-style: solid;
  border-top-color: var(--primary-100);
  align-items: center;
  justify-content: space-evenly;
  .nav-footer {
    display: flex;
    justify-content: space-around;
    min-width: 70px;
    padding: 10px 0;
  }
  .social {
    margin-right: 15px;
    margin-left: 15px;
  }
  .span {
    background-color: var(--black);
  }
`;

export default Footer;
