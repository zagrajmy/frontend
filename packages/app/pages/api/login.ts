import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";

import { makeAuth } from "../../src/app/auth";
import { noop } from "../../src/lib/noop";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    // we want to postpone the redirect
    const { end, writeHead } = res;
    res.end = noop;
    let writeArgs: unknown[] = [];
    res.writeHead = (...args: unknown[]) => {
      writeArgs = args;
      return res;
    };

    await makeAuth(req)!.handleLogin(req, res, {
      authParams: { scope: "openid email profile" },
    });

    setCookie({ res }, "zm|redirectTo", req.headers.referer || "/", {});

    res.writeHead = writeHead;
    res.end = end;
    res.writeHead(...(writeArgs as Parameters<typeof res.writeHead>)).end();
  } catch (error) {
    res.status(error.status || 500).end(error.message);
  }
}
