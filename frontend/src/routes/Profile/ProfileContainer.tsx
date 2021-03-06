import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Query } from 'react-apollo';
import { ApolloQueryResult, OperationVariables } from 'apollo-boost';
import { getProfileData, getRatedMovies } from 'types/api';
import { getMovieList } from 'types/local';
import Loading from 'components/Loading';
import { GET_PROFILE_DATA, GET_RATED_MOVIES } from './ProfileQueries';
import { GET_MOVIE_LIST } from './ProfileQueries.local';
import ProfilePresenter from './ProfilePresenter';

interface IParams {
  userId: string;
}

interface IProps extends RouteComponentProps<IParams> {}

class ProfileQueries extends Query<getProfileData> {}

class MovieListQueries extends Query<getMovieList> {}

class RatedMoviesQueries extends Query<getRatedMovies> {}

class ProfileContainer extends Component<IProps, {}> {
  private refetchProfile: (
    variables?: OperationVariables | undefined
  ) => Promise<ApolloQueryResult<getProfileData>>;
  private refetchRatedMovies: (
    variables?: OperationVariables | undefined
  ) => Promise<ApolloQueryResult<getRatedMovies>>;

  public componentDidMount() {
    if (this.refetchProfile) {
      this.refetchProfile();
    }
    if (this.refetchRatedMovies) {
      this.refetchRatedMovies();
    }
  }

  public render() {
    const { match } = this.props;
    if (match) {
      const {
        params: { userId }
      } = match;
      const intUserId = Number(userId);
      const offset = 0;
      return (
        <ProfileQueries
          query={GET_PROFILE_DATA}
          variables={{ userId: intUserId }}
        >
          {({
            data: profileData,
            loading: profileLoading,
            refetch: refetchProfile
          }) => {
            this.refetchProfile = refetchProfile;
            return (
              <RatedMoviesQueries
                query={GET_RATED_MOVIES}
                variables={{ userId: intUserId, offset }}
              >
                {({
                  data: ratedMoviesData,
                  loading: ratedMoviesLoading,
                  fetchMore,
                  refetch: refetchRatedMovies
                }) => {
                  this.refetchRatedMovies = refetchRatedMovies;
                  const ratedMovieIdList: number[] = [];
                  if (ratedMoviesData && ratedMoviesData.GetRatedMovies) {
                    const {
                      GetRatedMovies: { ratedMovies }
                    } = ratedMoviesData;
                    if (ratedMovies) {
                      ratedMovies.forEach(ratedMovie => {
                        ratedMovieIdList.push(ratedMovie.movieId);
                      });
                    }
                  }
                  return (
                    <MovieListQueries
                      query={GET_MOVIE_LIST}
                      variables={{ movieIdList: ratedMovieIdList }}
                    >
                      {({ data: movieListData, loading: movieListLoading }) => (
                        <>
                          {profileLoading ? (
                            <Loading />
                          ) : (
                            <ProfilePresenter
                              profileData={profileData}
                              ratedMovieData={ratedMoviesData}
                              ratedMoviesLoading={ratedMoviesLoading}
                              movieListData={movieListData}
                              movieListLoading={movieListLoading}
                              onLoadMore={() =>
                                fetchMore({
                                  variables: {
                                    offset: ratedMovieIdList.length
                                  },
                                  updateQuery: (prev, { fetchMoreResult }) => {
                                    if (
                                      ratedMoviesData &&
                                      ratedMoviesData.GetRatedMovies
                                        .ratedMovies &&
                                      fetchMoreResult &&
                                      fetchMoreResult.GetRatedMovies.ratedMovies
                                    ) {
                                      return Object.assign({}, prev, {
                                        GetRatedMovies: {
                                          ...ratedMoviesData.GetRatedMovies,
                                          ratedMovies: [
                                            ...ratedMoviesData.GetRatedMovies
                                              .ratedMovies,
                                            ...fetchMoreResult.GetRatedMovies
                                              .ratedMovies
                                          ]
                                        }
                                      });
                                    }
                                    return prev;
                                  }
                                })
                              }
                            />
                          )}
                        </>
                      )}
                    </MovieListQueries>
                  );
                }}
              </RatedMoviesQueries>
            );
          }}
        </ProfileQueries>
      );
    }
    return null;
  }
}

export default ProfileContainer;
