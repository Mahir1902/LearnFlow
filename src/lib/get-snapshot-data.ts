import axios from "axios";

export const getSnapshotData = async (snapshotId: string) => {
  try {
    const snapshotStatusResponse = await axios.get(
      `https://api.brightdata.com/datasets/v3/progress/${snapshotId}?format=json`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BRIGHT_DATA_API_KEY}`,
        },
      },
    );

    if (snapshotStatusResponse.data.status === "ready") {
      const snapshotDataResponse = await axios.get(
        `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`,
        {
          headers: {
            Authorization: `Bearer ${process.env.BRIGHT_DATA_API_KEY}`,
          },
          timeout: 120000,
        },
      );

      return snapshotDataResponse.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};
