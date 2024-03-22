import { IS_DEVELOPMENT } from "../consts";

/**
 * Send server-side mixpanel event
 * @param {string} eventName
 * @param {object} eventData
 */
export const mixpanelTrack = async (
  eventName: string,
  eventData: Record<string, string>
) => {
  if (IS_DEVELOPMENT) {
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
            ...eventData,
          },
        },
      ]),
    });
  } catch (err) {
    console.log("ERROR - Failed to send pixel");
  }
};
