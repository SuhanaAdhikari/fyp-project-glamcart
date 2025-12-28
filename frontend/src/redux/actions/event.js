import axios from "axios";
import { server } from "../../server";

// create event
export const createevent = (data) => async (dispatch) => {
  try {
    dispatch({ type: "eventCreateRequest" });

    const response = await axios.post(`${server}/event/create-event`, data);

    console.log("Event create response:", response);

    dispatch({
      type: "eventCreateSuccess",
      payload: response?.data?.event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    dispatch({
      type: "eventCreateFail",
      payload: error?.response?.data?.message || error.message || "Event creation failed",
    });
  }
};


// get all events of a shop
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getAlleventsShopRequest" });

    const response = await axios.get(`${server}/event/get-all-events/${id}`);

    dispatch({
      type: "getAlleventsShopSuccess",
      payload: response?.data?.events || [], // fallback to empty array
    });
  } catch (error) {
    console.error("getAllEventsShop error:", error); // ✅ log full error

    dispatch({
      type: "getAlleventsShopFailed",
      payload:
        error?.response?.data?.message || error.message || "Unable to fetch events",
    });
  }
};


// delete event of a shop
// delete event of a shop
export const deleteEvent = (id, shopId) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteeventRequest",
    });

    const response = await axios.delete(
      `${server}/event/delete-shop-event/${id}`,
      {
        withCredentials: true,
      }
    );

    if (!response || !response.data || !response.data.success) {
      throw new Error("Event deletion failed or malformed response.");
    }

    dispatch({
      type: "deleteeventSuccess",
      payload: response.data.message,
    });

    // ✅ Immediately refetch updated events
    const refreshed = await axios.get(
      `${server}/event/get-all-events/${shopId}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "getAlleventsShopSuccess",
      payload: refreshed.data.events,
    });

  } catch (error) {
    console.error("Delete event error:", error);

    dispatch({
      type: "deleteeventFailed",
      payload:
        error.response?.data?.message ||
        error.message ||
        "Event deletion failed",
    });
  }
};


// get all events
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAlleventsRequest",
    });

    const { data } = await axios.get(`${server}/event/get-all-events`);
    dispatch({
      type: "getAlleventsSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAlleventsFailed",
      payload: error.response.data.message,
    });
  }
};
