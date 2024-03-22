import protectAPI from "@/app/middleware/protectApi";
import { mixpanelTrack } from "@/app/utils/analytics";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POSTs") {
    try {
      const { email, eventName, eventData, debug } = JSON.parse(req.body);

      // eslint-disable-next-line no-undef
      await mixpanelTrack(email, eventName, eventData, debug);
      console.log(
        "DEBUG Mixpanel tracking event:",
        email,
        eventName,
        eventData
      );
      return res.status(200).send({ status: "success" });
    } catch (e) {
      console.log("ERROR Mixpanel api.trackMixpanelEvent failed", req.body, e);

      return res
        .status(500)
        .send(`ERROR Mixpanel api.trackMixpanelEvent tracking event failed`);
    }
  }
  return res.status(400).send({ error: "Invalid request type" });
};

export default protectAPI(handler);
