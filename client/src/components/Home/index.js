import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../Header';

const Home = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Container>
      {isAuthenticated ? <Header /> : <Header type="guest" />}
      <Logo src="/logo-circle.png" alt="logo" style={{ zIndex: 2 }} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '10vh',
          zIndex: 2,
        }}
      >
        {isAuthenticated ? (
          <Button to="/select">Start</Button>
        ) : (
          <>
            <Button to="/login">Login</Button>
            <Button to="/select">Guest</Button>
          </>
        )}
      </div>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  flex: 1;
  width: 75vw;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url('/calhartt.png') center;
`;

const Logo = styled.img`
  z-index: 2;

  :hover {
    filter: drop-shadow(2px 4px 8px #ffb300);
  }
`;

const Button = styled(Link)`
  background: #ff6f00;
  width: 10rem;
  height: 4rem;
  border-radius: 0.5rem;
  font-size: 1.7rem;
  color: black;
  margin: 0 3vw;
  text-align: center;
  vertical-align: middle;
  display: table-cell;
  line-height: 2.5;
  margin: 5px 0;

  :hover {
    color: white;
    box-shadow: 2px 4px 8px #ffb300;
  }
`;
