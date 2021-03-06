import { NextApiRequest, NextApiResponse } from "next";

import { makeAuth } from "../../src/app/auth";

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await makeAuth(req)!.handleLogout(req, res);
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}
