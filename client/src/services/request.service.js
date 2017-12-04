const API_ROOT = process.env.REACT_APP_HOST;

const handleFetchResponse = async response => {
  try {
    const parsedResponse = await response.json();
    if (!response.ok) {
      return Promise.reject(parsedResponse);
    }
    return parsedResponse;
  } catch (error) {
    return Promise.reject(error);
  }
};

const paramsToQuery = params =>
  Object.keys(params)
    .reduce((acc, key) => {
      const value = params[key];
      if (typeof value !== 'undefined') {
        acc.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        );
      }
      return acc;
    }, [])
    .join('&');

export const post = async (url, data) => {
  try {
    const response = await fetch(API_ROOT + url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': localStorage.getItem('token')
      },
      body: JSON.stringify(data)
    });
    return await handleFetchResponse(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const get = async (url, params) => {
  try {
    if (params) {
      url += '?' + paramsToQuery(params);
    }
    const response = await fetch(API_ROOT + url, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': localStorage.getItem('token')
      }
    });
    return await handleFetchResponse(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default {
  post,
  get
};
