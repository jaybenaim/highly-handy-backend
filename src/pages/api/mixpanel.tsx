import protectAPI from "@/app/middleware/protectApi";
import { mixpanelTrack } from "@/app/utils/analytics";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { eventName, eventData } = JSON.parse(req.body);

      // eslint-disable-next-line no-undef
      await mixpanelTrack(eventName, {
        ...eventData,
        $city: req.headers["x-vercel-ip-city"],
        $country: req.headers["x-vercel-ip-country"],
      });
      console.log("DEBUG Mixpanel tracking event:", eventName, {
        ...eventData,
        $city: req.headers["x-vercel-ip-city"],
        $country: req.headers["x-vercel-ip-country"],
      });
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
