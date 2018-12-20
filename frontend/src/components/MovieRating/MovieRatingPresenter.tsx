import React from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import { DatePicker, Button, Rate } from 'antd';

const MovieRatingContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
`;

const RatingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RatingTitle = styled.div`
  display: flex;
`;

const StarButtonContainer = styled.div`
  display: flex;
  margin-top: 8px;
`;

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  justify-content: center;
`;

const DateTitle = styled.div`
  display: flex;
`;

const DatePickerContainer = styled.div`
  display: flex;
  margin-top: 8px;
`;

const DateContainer = styled.div`
  display: flex;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-left: 10px;
  align-items: flex-end;
  justify-content: center;
`;

interface IProps {
  rating: number;
  watchDate: string;
  handleClickRating?: (rating: number) => void;
  handleClickWatchDate?: (date: moment.Moment, dateString: string) => void;
  setMovieRating?: () => void;
}

const dateFormat = 'YYYY/MM/DD';

const MovieRatingPresenter: React.FunctionComponent<IProps> = ({
  rating,
  watchDate,
  handleClickRating,
  handleClickWatchDate,
  setMovieRating
}) => (
  <MovieRatingContainer>
    {handleClickRating && handleClickWatchDate && setMovieRating ? (
      <>
        <RatingWrapper>
          <RatingTitle>평가해주세요</RatingTitle>
          <StarButtonContainer>
            <Rate
              allowHalf={true}
              style={{ fontSize: '28px' }}
              value={rating}
              onChange={handleClickRating}
            />
          </StarButtonContainer>
        </RatingWrapper>
        <DateWrapper>
          <DateTitle>언제 보셨나요?</DateTitle>
          <DatePickerContainer>
            <DatePicker
              defaultValue={moment(new Date(), dateFormat)}
              format={dateFormat}
              onChange={handleClickWatchDate}
            />
          </DatePickerContainer>
        </DateWrapper>
        <ButtonWrapper>
          <Button
            type="dashed"
            shape="circle"
            icon="check"
            onClick={setMovieRating}
          />
        </ButtonWrapper>
      </>
    ) : (
      <>
        <RatingWrapper>
          <StarContainer>
            <Rate
              disabled={true}
              allowHalf={true}
              defaultValue={rating}
              style={{ fontSize: '24px' }}
            />
          </StarContainer>
        </RatingWrapper>
        <DateWrapper>
          <DateContainer>
            {moment(new Date(watchDate)).format(dateFormat)}
          </DateContainer>
        </DateWrapper>
        <ButtonWrapper>
          <Button type="dashed" shape="circle" icon="delete" />
        </ButtonWrapper>
      </>
    )}
  </MovieRatingContainer>
);

export default MovieRatingPresenter;
