import protectAPI from "@/app/middleware/protectApi";
import { mixpanelTrack } from "@/app/utils/analytics";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { eventName, eventData } = JSON.parse(req.body);

      const ip =
        req.headers["x-real-ip"] && req.headers["x-real-ip"].length > 0
          ? req.headers["x-real-ip"][0]
          : "unknown";

      await mixpanelTrack(
        eventName,
        {
          ...eventData,
          $city: req.headers["x-vercel-ip-city"],
          $country: req.headers["x-vercel-ip-country"],
        },
        ip
      );

      console.log("Sent tracking event - ", eventName);
      return res.status(200).send({ status: "success" });
    } catch (e) {
      console.log(
        "ERROR Mixpanel api.trackMixpanelEvent failed",
        JSON.stringify(req.body, null, 2),
        e
      );

      return res
        .status(500)
        .send(`ERROR Mixpanel api.trackMixpanelEvent tracking event failed`);
    }
  }
  return res.status(400).send({ error: "Invalid request type" });
};

export default protectAPI(handler);
