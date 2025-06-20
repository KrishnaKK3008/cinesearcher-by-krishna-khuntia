import { keysToSnakeCase } from "neetocist";
import { stringify } from "qs";
import { isEmpty, toPairs, pipe, omit } from "ramda";

export const getUrlParams = search => {
  const queryParams = new URLSearchParams(search);
  const query = queryParams.get("query") || "";
  const page = Number(queryParams.get("page")) || 1;

  return { query, page };
};

export const buildSearchString = ({ query, page }) => {
  const queryParams = new URLSearchParams();
  if (query) {
    queryParams.set("query", query);
  }

  if (page > 1) {
    queryParams.set("page", String(page));
  }

  return queryParams.toString();
};

export const buildUrl = (route, params) => {
  const placeHolders = [];
  toPairs(params).forEach(([key, value]) => {
    if (route.includes(`:${key}`)) {
      placeHolders.push(key);
      route = route.replace(`:${key}`, encodeURIComponent(value));
    }
  });

  const queryParams = pipe(
    omit(placeHolders),
    keysToSnakeCase,
    stringify
  )(params);

  return isEmpty(queryParams) ? route : `${route}?${queryParams}`;
};
