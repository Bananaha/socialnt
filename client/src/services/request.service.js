const API_ROOT = process.env.REACT_APP_HOST;

const cache = {};
const handleFetchResponse = async (response, url) => {
  try {
    const parsedResponse = await response.json();
    if (!response.ok) {
      return Promise.reject(parsedResponse);
    }
    if (process.env.REACT_APP_CACHE === 'true' && url) {
      cache[url] = JSON.stringify(parsedResponse);
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
      if (typeof value !== "undefined") {
        acc.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        );
      }
      return acc;
    }, [])
    .join("&");

const withTokenHeader = (headers = {}) => ({
  ...headers,
  "X-CSRF-Token": localStorage.getItem("token")
});

const joinJSONPath = (...args) => args.filter(arg => arg).join('.');

const appendFormData = (formData, data, name = '') => {
  if (typeof data === "object" && data && !(data instanceof Date)) {
    Object.keys(data).forEach(key => {
      appendFormData(formData, data[key], joinJSONPath(name, key));
    });
  } else {
    formData.append(name, data);
  }
};

const toFormData = (data, files) => {
  const formData = new FormData();
  appendFormData(formData, data);
  Array.isArray(files)
    ? files.forEach(file => formData.append("file", file))
    : formData.append("file", files);
  return formData;
};

export const post = async (url, data, files) => {
  const hasFile = Array.isArray(files) ? files.length > 0 : !!files;
  const req = !hasFile
    ? {
      headers: withTokenHeader({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    }
    : {
      headers: withTokenHeader({}),
      body: toFormData(data, files),
    };
  console.log('post with files?', !!files, req.body);
  try {
    const response = await fetch(API_ROOT + url, {
      method: 'POST',
      ...req
    });
    console.log('POST');
    return await handleFetchResponse(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const del = async (url, data) => {
  try {
    const response = await fetch(API_ROOT + url, {
      method: "delete",
      headers: withTokenHeader({
        Accept: "application/json",
        "Content-Type": "application/json"
      })
    });
    return await handleFetchResponse(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const get = async (url, params) => {
  let finalUrl = API_ROOT + url;
  try {
    if (params) {
      finalUrl += "?" + paramsToQuery(params);
    }
    if (cache[finalUrl]) {
      return JSON.parse(cache[finalUrl]);
    }
    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: withTokenHeader()
    });
    return await handleFetchResponse(response, finalUrl);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default {
  post,
  get,
  del,
};