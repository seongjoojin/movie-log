import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../../utils/privateResolver';
import { getPopular } from '../../../utils/tmdb';

const resolvers: Resolvers = {
  Query: {
    GetPopular: privateResolver(async _ => getPopular())
  }
};

export default resolvers;
