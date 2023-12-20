/**
 * This hook will return React Query cached data based on query key only if data is already cached
 * @param {String} queryKey Provide Query Key as an Array
 * @returns {Object} Return cached data object or if data is not cached return Undefined
 */

import { QueryClient } from "@tanstack/react-query";

const UseCacheData = (queryKey) => {
  const queryClient = new QueryClient();

  const cachedData = queryClient.getQueryData(queryKey);

  return cachedData;
};

export default UseCacheData;
