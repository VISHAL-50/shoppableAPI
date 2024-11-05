const admin = require("firebase-admin");
const axios = require("axios");
const { Timestamp } = require("firebase-admin/firestore");
const { setTimeout } = require("timers/promises");
const { format, compareAsc } = require("date-fns");

// const serviceAccount = {
//   type: "service_account",
//   project_id: process.env.project_id,
//   private_key_id: process.env.private_key_id,
//   private_key: process.env.private_key.replace(/\\n/g, "\n"),
//   client_email: process.env.client_email,
//   client_id: process.env.client_id,
//   auth_uri: process.env.auth_uri,
//   token_uri: process.env.token_uri,
//   auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
//   client_x509_cert_url: process.env.client_x509_cert_url,
// };

const serviceAccount = {
  type: "service_account",
  project_id: "tripbuilder-14de0",
  private_key_id: "de95ac0b4559cf5751dd51291200c4cfb4b36272",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0Mt4C05dY4U6H\nD2YldM+Cq4OvBn4oekbrcHAJpJTL87Y9fNHasDgWQCPFnqKAkChz2HxBAutdb3Ja\nUDg8vUtswZwr5j/pLcgJpTU49w7YZdnWEI5MkGbFmPQkhG2rDxpHWRmZOgL3VyXd\nJsTmtjEtcfuLGt6bLKNPzXDsC4qulxvk7KI+RMU2iRlsQi7KRiZW3BNIEYHjFrhm\nnV6ELIe3/qqtNoTlBJEoGYGF/Sd8RsquFPD/lxxX6EFAbJ50LE/102CV+5SzE0gS\nUeG/NnoJreTF64odpwExWWbJdNZNsl2nkpfH0Mq85OccMOYJHPYMLO9NdECffVhC\n3SKIsNThAgMBAAECggEABtdljsA/dJbn7IByVYVipCiPMSkdx2X5D6hEVgFjICkq\nZ+7iEsZHotn1jGOyR2TxvDrhtiApFRzi6mM1ogy3x93D6EtvbWgZD6YE6BrtJocb\nZvatnbeKcgHAHIDQnxgi3HGZY163TR0IaXs21OGMQBhIlLvvlqmdBlhw60KhlcZD\nl9fV5QAfOWwHZpDtq4VcTQuHSLUfoFEfcoCl+PLKqrLHoNSIXNc32yxzPG+b2EaT\n700Jb8ONOjITjmEE21cfuJFv4EXouz8h2fVR8eki12sxNFlsWgEcAk6jlyYY8/BE\nspWcvsv13KySdtYlTxSFDJEWzbsls9kP2AVkku40SQKBgQDfNGk46/zLLONyYCfI\nxytmW+eSYX/MM1UDMs9NPe6GbTIjZls6gZz8UBIQ9fg7YnJ7knjUft9Hn2OQL48v\nH4ulsanv+mm3fCld23gFlafAIxSfHPqItcfo10kq2b7iMZYTy4tUpZrHIfYH+5f0\nrrAC5zUlKw85LQJAnRuu6FaZ7QKBgQDOrNV5QGCLJ7/w9jkRnZ7XQnZC+QM6c4IC\nv8XbMoMduWzTukd9nzU7dp1w6tDZhke6ALUw+w1L8P07b7OwoHl1dykRgFgO7V0R\n1WY9+++aRke4s1HjIU/oytRY51uKKrKcDAtyWdoIryyftPdgynhSmPV0I6srqfYO\nkVew8rO4RQKBgC1+k0vk3dvTxHBVpQZJglEUvniZouDOPa+vNY2659lCfIu2mzWr\noYHUGDqYyAXipQ8G5dX6HiyNElAbQYYLWf1l3wto8Q9TIWNeDnKk9FI3VEayM2aW\nFq8g4mr3gu67yKk0Pav9LTUVeP5bi7d1u657zdtLkYjH4cOlwjS+aphpAoGBAJ6B\n8atv01uGXfBZdwVqpMMlRvwwbOhsZF7lY8KsZ+DpMGzmJiRTcYksfK14ejsKgIJI\nPq7VLKp8pkrqbZ7eRKjxff7dNywjocimqSaKzYW9tw4SAZC4IMhCnz+cGRnLi3ag\nyjqmbNFSQGAwc7W5MzTt+PpczM/NJ1ie4ellCq8dAoGBAKxYowdX6XdW/42iSPsm\ntMhCkp0+plpmSO9Bi9z85Uc8HGs0e+bbVunFhIYNxx0qLt702ixSMbKp0UaDxbTm\nzWAd6wlRz5ZraC7Du4h+1cdMShh6bVZBeMzWqEbT6YK5Mho/ZLV2CUrU8TJUOY4B\n+pw4rxUlw5CClAluHPczfuQl\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-b0g5z@tripbuilder-14de0.iam.gserviceaccount.com",
  client_id: "111031300417714276422",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-b0g5z%40tripbuilder-14de0.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// Initialize Firebase Admin
// const serviceAccount = require("./serviceAccountKey.json");
// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Log a message to indicate that Firebase has been initialized
console.log("Firebase Admin initialized successfully");

const db = admin.firestore();
console.log("Firestore database initialized successfully");

class ShoppableAPI {
  constructor() {
    console.log("ShoppableAPI initialized");
  }

  async getBrandCampaignData(campaignId) {
    try {
      const docRef = db.collection("brand_campaigns").doc(campaignId);
      const doc = await docRef.get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error(`Error fetching campaign data: ${error}`);
      return null;
    }
  }

  async getMediaFromId(postVid, token) {
    try {
      const response = await axios.post(
        "https://www.tripbuilder.in/php/instaAuth.php/get-store-page",
        { id: postVid, token },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        return response.data.media_url || "";
      }
    } catch (error) {
      console.error(`Error fetching media from ID ${postVid}: ${error}`);
    }
    return "";
  }

  async getMediaDataFromId(postVid, token) {
    try {
      const response = await axios.post(
        "https://www.tripbuilder.in/php/instaAuth.php/get-store-page",
        { id: postVid, token },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.status === 200 ? response.data : {};
    } catch (error) {
      console.error(`Error fetching media data for ID ${postVid}: ${error}`);
      return {};
    }
  }

  async getToken(hotelDocId) {
    try {
      const docRef = db.collection("hotels_for_approval").doc(hotelDocId);
      const snap = await docRef.get();
      const data = snap.data();
      return data && data.instagram ? data.instagram.access_token || "" : "";
    } catch (error) {
      console.error(
        `Error fetching token for hotel ID ${hotelDocId}: ${error}`
      );
      return "";
    }
  }

  async getHotelInfo(hotelDocId) {
    try {
      const docRef = db.collection("hotels_for_approval").doc(hotelDocId);
      const snap = await docRef.get();
      if (snap.exists) {
        const data = snap.data();
        return {
          hotel_name: data.hotel_name || "",
          hotellogo: data.hotellogo || "",
          hotellink: data.hotellink || "",
        };
      }
    } catch (error) {
      console.error(`Error fetching hotel info for ID ${hotelDocId}: ${error}`);
    }
    return {};
  }

  async getCampaignInfo(campaignId) {
    const campaignData = await this.getBrandCampaignData(campaignId);
    if (!campaignData) return {};

    const token = await this.getToken(campaignData.hoteldocid || "");
    const hotelInfo = await this.getHotelInfo(campaignData.hoteldocid || "");
    if (!token) return {};

    const response = {
      campaignDetails: campaignData.campaignDetails || "",
      active_status: campaignData.active_status || false,
      campaignLink: campaignData.campaignLink || "https://app.tripbuilder.in/",
      campaignId,
      videoId: [],
      videoData: [],
      hotelName: campaignData.hotelName || "",
      hoteldocid: campaignData.hoteldocid || "",
      campaignPhoto: campaignData.campaignPhoto || "",
      offerPrice: campaignData.offerPrice || {},
      campaignName: campaignData.campaignName || "Test Cam",
      hotelInfo,
    };

    const videoIds = campaignData.videoId || [];
    const videoDataBatch = await this.fetchVideoDataBatch(videoIds, token);

    videoIds.forEach((videoId) => {
      if (videoDataBatch[videoId]) {
        const videoData = videoDataBatch[videoId];
        response.videoData.push(videoData);
        response.videoId.push(videoData.media_url);
      }
    });

    return response;
  }

  isDateOlder(dateStr) {
    try {
      const campaignEndDate = new Date(dateStr);
      return Date.now() > campaignEndDate;
    } catch (error) {
      console.error(`Date parsing error for date ${dateStr}: ${error}`);
      return true;
    }
  }

  async getAllCampaignsForHotel(hotelDocId) {
    const response = {};
    const campaigns = [];
    // const hotelDocId = "d2447b80-05cd-1ffc-8da0-d58e3051e5ea";
    console.log(`Fetching campaigns for hotel ID: ${hotelDocId}`);

    try {
      // Fetch campaigns for the specified hotel
      const snap = await db
        .collection("brand_campaigns")
        .where("hoteldocid", "==", hotelDocId)
        .get();

      // Fetch hotel information
      const hotelInfo = await this.getHotelInfo(hotelDocId);

      // Filter valid campaigns
      const filteredSnap = snap.docs.filter((doc) =>
        this.isValidCampaign(doc.data())
      );

      // Get detailed information for each valid campaign
      const promises = filteredSnap.map((doc) => this.getCampaignInfo(doc.id));
      const results = await Promise.allSettled(promises);

      // Collect fulfilled results
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          campaigns.push(result.value);
        } else {
          console.warn(`Failed to get campaign info: ${result.reason}`);
        }
      });

      response.campaigns = campaigns;
      response.hotel_info = hotelInfo;
    } catch (error) {
      console.error(
        `Error retrieving campaigns for hotel ID: ${hotelDocId} - ${error}`
      );
    }

    // console.log("Final response:", response);
    return response;
  }

  isValidCampaign(data) {
    return data && !data.is_draft && !this.isDateOlder(data.campaignEndDate);
  }

  async fetchVideoDataBatch(postVids, token) {
    const videoDataBatch = {};

    try {
      // Fetch all videos in one go using Firestore batch querying
      const snap = await db
        .collection("videos_data")
        .where("videoId", "in", postVids)
        .get();

      // Prepare parallel URL validity checks and invalid URL handling
      const promises = snap.docs.map(async (doc) => {
        const data = doc.data();
        if (data && data.media_url) {
          const isValid = await this.checkUrlValidity(data.media_url); // Check URL validity in parallel
          if (isValid) {
            videoDataBatch[data.videoId] = data;
          } else {
            // Handle invalid URL in parallel
            const updatedData = await this.handleInvalidUrl(
              data.videoId,
              token
            );
            if (updatedData) {
              videoDataBatch[data.videoId] = updatedData;
            }
          }
        }
      });

      await Promise.all(promises); // Wait for all parallel tasks to complete
    } catch (error) {
      console.error(`Error fetching video data batch: ${error}`);
    }

    // Fetch missing videos in parallel
    const missingPostVids = postVids.filter((vid) => !(vid in videoDataBatch));
    const newVideoData = await Promise.all(
      missingPostVids.map((postVid) => this.fetchAndUpdateVideo(postVid, token))
    );

    // Save new video data in one batch operation
    if (newVideoData.length > 0) {
      await this.batchSaveVideoData(newVideoData.filter(Boolean)); // Filter out null/undefined results
    }

    // Update the batch with new video data
    newVideoData.forEach((video) => {
      if (video) {
        videoDataBatch[video.videoId] = video;
      }
    });

    return videoDataBatch;
  }

  async checkUrlValidity(url) {
    try {
      const response = await axios.head(url);
      return response.status === 200;
    } catch (error) {
      console.error(`Error checking URL validity for ${url}: ${error}`);
      return false;
    }
  }

  async handleInvalidUrl(postVid, token) {
    try {
      const data = await this.getMediaDataFromId(postVid, token);
      const { thumbnail_url, media_url } = data;

      if (!media_url || !(await this.checkUrlValidity(media_url))) {
        console.log(
          `Invalid URL for ID ${postVid}. Attempting to fetch new data.`
        );
        return this.fetchAndUpdateVideo(postVid, token);
      }

      await this.saveVideoData(postVid, media_url, thumbnail_url);
      return { videoId: postVid, media_url, thumbnail_url };
    } catch (error) {
      console.error(`Error handling invalid URL for ID ${postVid}: ${error}`);
      return null;
    }
  }

  async fetchAndUpdateVideo(postVid, token) {
    try {
      const response = await axios.post(
        "https://www.tripbuilder.in/php/instaAuth.php/get-store-page",
        { id: postVid, token },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const { media_url, thumbnail_url } = response.data;
        if (media_url && thumbnail_url) {
          await this.saveVideoData(postVid, media_url, thumbnail_url);
          return { videoId: postVid, media_url, thumbnail_url };
        }
      }
    } catch (error) {
      console.error(`Error fetching video data for ID ${postVid}: ${error}`);
    }
    return null;
  }

  async saveVideoData(postVid, media_url, thumbnail_url) {
    try {
      const videoData = { videoId: postVid, media_url, thumbnail_url };
      await this.batchSaveVideoData([videoData]);
    } catch (error) {
      console.error(`Error saving video data for ID ${postVid}: ${error}`);
    }
  }

  async batchSaveVideoData(videoDataList) {
    const batch = db.batch();
    videoDataList.forEach((videoData) => {
      const docRef = db.collection("videos_data").doc(videoData.videoId);
      batch.set(docRef, videoData);
    });
    try {
      await batch.commit();
    } catch (error) {
      console.error(`Error saving video data batch: ${error}`);
    }
  }
}

// module.exports = ShoppableAPI;
const express = require("express");
// const ShoppableAPI = require("./index.js");
const port = process.env.PORT || 8000;
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const api = new ShoppableAPI();

// Route to get all campaigns for a hotel
app.get("/:hotelDocId", async (req, res) => {
  const campiagnid = req.params.hotelDocId;
  const data = await api.getAllCampaignsForHotel(campiagnid);

  res.json(data);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// const ShoppableAPI = require("./shoppableAPI");
// exports.handler = async (event) => {
//   console.log("Received event:", JSON.stringify(event, null, 2));

//   try {
//     const api = new ShoppableAPI();
//     const hotelDocId = event.queryStringParameters?.pet;

//     if (!hotelDocId) {
//       return {
//         statusCode: 400,
//         headers: {
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//         },
//         body: JSON.stringify({
//           error: "Missing required parameter: pet (hotelDocId)",
//         }),
//       };
//     }

//     const data = await api.getAllCampaignsForHotel(hotelDocId);

//     return {
//       statusCode: 200,
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*",
//       },
//       body: JSON.stringify(data),
//     };
//   } catch (error) {
//     console.error("Error processing request:", error);

//     return {
//       statusCode: 500,
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*",
//       },
//       body: JSON.stringify({
//         error: "Internal Server Error",
//         message: error.message,
//       }),
//     };
//   }
// };
