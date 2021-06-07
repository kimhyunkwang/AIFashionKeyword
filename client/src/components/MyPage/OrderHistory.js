import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userinfo } from '../../actions/mypage';

export default function OrderHistory() {
  const history = useHistory();
  // const data = useSelector((state) => state.mypage.order_history);
  const data = [];
  // redux store에서 useSelector로 받아오기

  return (
    <Container>
      <h2>Order History</h2>
      <ScrollingList>
        {data.slice(1).map((el) => {
          const [id, time, price] = el.split(',');
          return (
            <HistoryCard
              onClick={() => {
                history.push(`/orderhistory/${id}`);
              }}
            >
              <span>{time.split('.')[0]}</span>
              <span>${price}</span>
            </HistoryCard>
          );
        })}
      </ScrollingList>
    </Container>
  );
}

const Container = styled.div`
  height: 40rem;
  border: solid 0.1rem #ff6f00;
  border-radius: 0.8rem;
  padding: 2rem 1rem;
  grid-area: history;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
`;

const ScrollingList = styled.div`
  width: 80%;
  height: 30rem;
  overflow: auto;
  margin-top: 2rem;
`;

const HistoryCard = styled.div`
  border-radius: 0.5rem;
  border: gray solid 0.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: 1.2rem;
  padding: 2rem;

  width: 90%;
  height: 5rem;
  margin: 1rem auto;

  cursor: pointer;

  :hover {
    border: solid 0.1rem #ff6f00;
    box-shadow: 0 0 10px #ffecb3;
  }
`;
