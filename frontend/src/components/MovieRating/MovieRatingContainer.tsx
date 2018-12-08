import React, { Component } from 'react';
import MovieRatingPresenter from './MovieRatingPresenter';
import { getMovieDetail_GetMovieRatings_movieRatings } from 'src/types/api';

interface IProps {
  movieRating?: getMovieDetail_GetMovieRatings_movieRatings;
  handleClickMovieRating?: (rating: number) => void;
}

class MovieRatingContainer extends Component<IProps> {
  public render() {
    const { movieRating, handleClickMovieRating } = this.props;
    if (movieRating) {
      const { createdAt } = movieRating;
      const now = new Date();
      const created = new Date(createdAt);
      const modifyAvailable =
        now.getTime() - created.setHours(created.getHours() + 24) > 0;
      console.log(modifyAvailable);
      if (modifyAvailable && handleClickMovieRating) {
        // 수정이 가능한 상태
        return (
          <MovieRatingPresenter
            modifyAvailable={true}
            rating={movieRating.rating}
            handleClickMovieRating={handleClickMovieRating}
          />
        );
      } else if (!modifyAvailable) {
        // 수정이 불가능한 상태
        return <MovieRatingPresenter rating={movieRating.rating} />;
      }
      return null;
    }
    return (
      // 점수 등록
      <MovieRatingPresenter
        modifyAvailable={true}
        handleClickMovieRating={handleClickMovieRating}
      />
    );
  }
}

export default MovieRatingContainer;
