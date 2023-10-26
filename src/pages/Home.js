import styled from "styled-components";
// import main from "../assets/eth.svg";
function Home() {
  return (
    <>
      <Wrapper className="page">
        <div className="info">
          <h2>
            <span>Web3</span>
            Banking
          </h2>
          <div>
            <ul>
              <li>Connect Wallet</li>
              <li>Deposit USDC </li>
              <li>Send USDC without Gas or Fees</li>
              <li>Withdraw USDC</li>
            </ul>
          </div>

          {/* <Link to="/login" className="btn">
            Sign In
          </Link>
          <Link to="/register" className="btn">
            Sign Up
          </Link> */}
        </div>
        {/* <img src={main} alt="job hunt" className="img main-img" /> */}
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  h2 {
    font-weight: 700;
  }
  h2 span {
    color: var(--primary-200);
  }
  .main-img {
    display: none;
  }
  li::marker {
    color: var(--primary-200);
    content: "◍";
  }
  li {
    padding-left: 12px;
    cursor: pointer;
  }

  @media (max-width: 830px) {
    align-items: start;
  }
`;

export default Home;
