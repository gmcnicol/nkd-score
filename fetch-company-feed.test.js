"use strict";
jest.mock("node-fetch");
const fetchCompanyFeed = require("./fetch-company-feed");
const fetch = require("node-fetch");

const {Response} = jest.requireActual("node-fetch");
test("fetchCompanyFeed is defined", () => {
  expect(fetchCompanyFeed).toBeDefined();
});

test("Fetch fetches the correct url", async () => {
  const response = new Response("<xml />");
  fetch.mockReturnValue(Promise.resolve(response));
  const feed = await fetchCompanyFeed("epic");
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith("https://www.investegate.co.uk/Rss.aspx?company=epic", {
    compress: false,
    method: "GET"
  });
  expect(feed).toBeDefined();
});