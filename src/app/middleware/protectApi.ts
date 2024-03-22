import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { IS_DEVELOPMENT } from "../consts";

const protectAPI = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (IS_DEVELOPMENT) {
      return handler(req, res);
    }

    try {
      if (
        !req.headers.referer ||
        !new URL(req.headers.referer).origin.includes("highlyhandy")
      ) {
        console.log("[ERROR] DENIED ENTRY:", req.headers);
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
    } catch (err) {
      console.log("[ERROR] protectAPI", req.headers, err);

      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    return handler(req, res);
  };
};

export default protectAPI;
