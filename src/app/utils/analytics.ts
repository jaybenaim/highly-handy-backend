import { IS_DEVELOPMENT } from "../consts";

/**
 * Send server-side mixpanel event
 * @param {string} email
 * @param {string} eventName
 * @param {object} eventData
 */
export const mixpanelTrack = async (
  email: string,
  eventName: string,
  eventData: Record<string, string>,
  debug = false
) => {
  if ((email?.includes("renotag") || IS_DEVELOPMENT) && !debug) {
    console.log("Mixpanel Event not tracked due to DEV environment");
    return;
  }
  try {
    // eslint-disable-next-line no-undef
    await fetch("https://api.mixpanel.com/track", {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          event: eventName,
          properties: {
            token: process.env.NEXT_MIXPANEL_TOKEN,
            distinct_id: email,
            ...eventData,
          },
        },
      ]),
    });
  } catch (err) {
    console.log("ERROR - Failed to send pixel");
  }
};
