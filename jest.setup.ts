import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();
global.fetch = fetchMock as unknown as typeof fetch;
