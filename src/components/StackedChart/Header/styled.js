import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 8px;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const DailyChange = styled.div`
  display: inline-block;
  font-size: 16px;
  font-weight: 500;
`;

const Date = styled.p`
  font-size: 12px;
  margin-top: 0;
`;

export { Container, Title, FlexContainer, DailyChange, Date };
