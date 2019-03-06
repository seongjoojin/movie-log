import React from 'react';
import Helmet from 'react-helmet';
import { Alert, Divider } from 'antd';
import styled from 'styled-components';
import { getMovieDetail } from 'src/types/local';
import { getMovieRatings } from 'src/types/api';
import MovieHeader from 'src/components/MovieHeader';
import MovieInfo from 'src/components/MovieInfo';
import MovieCardList from 'src/components/MovieCardList';

const MovieInfoContinaer = styled.div`
  background-color: #fff;
  padding: 36px;
  border-radius: 4px;
  box-shadow: 0 1px 4px #e8e8e8;
`;

const MovieListTitle = styled.h4`
  display: flex;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 14px;
`;

interface IProps {
  movieLoading: boolean;
  movieData: getMovieDetail;
  ratingData: getMovieRatings | undefined;
  handleMovieRatingApply: (rating: number, watchDate: string) => void;
  handleMovieRatingRemove: (id: number) => void;
}

const MoviePresenter: React.FunctionComponent<IProps> = ({
  movieLoading,
  movieData,
  ratingData,
  handleMovieRatingApply,
  handleMovieRatingRemove
}) => {
  const {
    GetMovieDetail: { ok, movie },
    GetMovieRecommendations,
    GetMovieSimilar
  } = movieData;
  return (
    <>
      {ok && movie ? (
        <>
          <Helmet>
            <title>{movie.title} | Movie-log</title>
          </Helmet>
          <MovieInfoContinaer>
            <MovieHeader
              movie={movie}
              ratingData={ratingData}
              handleMovieRatingApply={handleMovieRatingApply}
              handleMovieRatingRemove={handleMovieRatingRemove}
            />
            <Divider />
            <MovieInfo movie={movie} />
            <Divider />
            <MovieCardList
              title={<MovieListTitle>추천 영화 목록</MovieListTitle>}
              loading={movieLoading}
              movieList={GetMovieRecommendations.slice(0, 8)}
            />
            <Divider />
            <MovieCardList
              title={<MovieListTitle>비슷한 영화 목록</MovieListTitle>}
              loading={movieLoading}
              movieList={GetMovieSimilar.slice(0, 8)}
            />
          </MovieInfoContinaer>
        </>
      ) : (
        <>
          <Helmet>
            <title>정보가 존재하지 않습니다. | Movie-log</title>
          </Helmet>
          <Alert
            message="Error"
            description="해당 영화 정보를 가져올 수 없습니다."
            type="error"
            showIcon={true}
          />
        </>
      )}
    </>
  );
};

export default MoviePresenter;
