import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

export default function ChoiceSummary() {
  const categoryList = useSelector(
    (state) => state.setCategoryReducer.category,
  );
  const selectedProducts = useSelector(
    (state) => state.selectProductReducer.selectedProducts,
  );

  const choiceSummaryArray = [];
  const choiceSummary = () => {
    console.log('categoryList:', categoryList);
    let totalPrice = 0;

    categoryList.map((category) => {
      let priceSumPerCategory = 0;
      if (selectedProducts[category]) {
        selectedProducts[category].map((product) => {
          priceSumPerCategory += Number(product.price);
        });
      }
      console.log('priceSumPerCategory:', priceSumPerCategory);
      const categoryName = category.toUpperCase();
      choiceSummaryArray.push(
        <div key={categoryName}>
          <ChosenCategory>{categoryName}</ChosenCategory>
          <p>{priceSumPerCategory}</p>
        </div>,
      );
      totalPrice += priceSumPerCategory;
    });

    console.log('totalPrice:', totalPrice);
    choiceSummaryArray.push(
      <TotalSummary key="total">
        <p>Total Price</p>
        <p>{totalPrice.toFixed(2)}</p>
      </TotalSummary>,
    );

    return choiceSummaryArray;
  };

  return (
    <ChoiceSummaryContainer>
      <Card
        title="Price Info"
        headStyle={{
          fontSize: '1.7rem',
          fontWeight: 'bold',
          borderBottom: '0.1rem solid #ff6f00',
        }}
        style={{
          width: '15rem',
          position: 'fixed',
          borderRadius: '2rem',
          background: '#f0f0f0',
        }}
      >
        <ChoiceSummaryDiv>{choiceSummary()}</ChoiceSummaryDiv>
      </Card>
    </ChoiceSummaryContainer>
  );
}

const ChoiceSummaryContainer = styled.div`
  display: inline-block;
  // margin-right: 200px;
  margin-top: 10px;
`;

const ChoiceSummaryDiv = styled.div`
  font-size: 1.5rem;
`;
const ChosenCategory = styled.p`
  font-weight: bold;
`;

const TotalSummary = styled.div`
  font-weight: bold;
  border: solid 1px #ff6f00;
  padding-top: 10px;
  border-radius: 1rem;
`;
