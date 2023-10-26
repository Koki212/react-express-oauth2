export default async function request(resource, method = 'GET', data = {}, authenticated = true) {
  // check if frontend is running in dev mode
  const isDev = window.location.port === '5173';

  // if frontend is running in dev mode, set localhost with different port as url, otherwise use the same url
  const url = isDev
    ? `http://localhost:3000/api${resource}`
    : `/api${resource}`;

  // add authentication header if request should be authenticated
  const headers = authenticated
    ? {
      // TODO: add auth header
    }
    : {};

  // add content type header for requests that contain a body
  if (method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  // add data stringified (if its not a GET request)
  const body = method !== 'GET'
    ? JSON.stringify(data)
    : undefined;

  // TODO: handle auth expired

  // send request
  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  // check status and parse response data
  if (response.status >= 200 && response.status < 300) {
    const result = await response.json();
    return result;
  }

  // just throw an error if status was not ok
  throw new Error(`Server responded with Status ${response.status}`);
}

export function get(resource, authenticated = true) {
  return request(resource, 'GET', {}, authenticated);
}

export function post(resource, data, authenticated = true) {
  return request(resource, 'POST', data, authenticated);
}

export function put(resource, data, authenticated = true) {
  return request(resource, 'PUT', data, authenticated);
}

// we cannot name the function `delete` as it is a reserved word in javascript
export function del(resource, data, authenticated = true) {
  return request(resource, 'DELETE', data, authenticated);
}