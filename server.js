const express = require("express");
const axios = require("axios");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/get-products", async (req, res) => {
  const options = {
    method: "GET",
    url: "https://ebay-scrapper.p.rapidapi.com/get",
    params: {
      url: "https://www.ebay.com/itm/",
    },
    headers: {
      "X-RapidAPI-Key": "0402c118b2msh44c7a59bbb3b6eep18ad7bjsn4c5c057fb9d7",
      "X-RapidAPI-Host": "ebay-scrapper.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/amazon-offers", async (req, res) => {
  try {
    const amazonApiUrl =
      "https://na.business-api.amazon.com/products/2020-08-26/products/B091WR26F4/offers";

    const headers = { Authorization: `Bearer ${accessKey}` };

    const queryParams = {
      productRegion: "IN",
      locale: "en_IN",
      facets: "OFFERS",
    };

    const response = await axios.get(amazonApiUrl, {
      headers,
      params: queryParams,
    });

    const offers = response.data;

    res.json({ success: true, offers });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/product-prices", async (req, res) => {
  try {
    const apiUrl = "https://api.escuelajs.co/api/v1/products?title";
    const response = await axios.get(apiUrl);
    const products = response.data;

    const prices = products.map((product) => ({
      title: product.title,
      price: product.price,
    }));
    res.json({ success: true, prices });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
