const express = require("express");
const axios = require("axios");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const ExcelJs = require("exceljs");
const { connectDb } = require("./database/db");

dotenv.config();
connectDb();

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
    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/amazon-offers", async (req, res) => {
  const accessKey = "";
  try {
    const amazonApiUrl =
      "https://na.business-api.amazon.com/products/2020-08-26/products";

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
      id: "",
    }));
    res.json({ success: true, prices });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/store-products", async (req, res) => {
  const { productUrl } = req.body;
  try {
  } catch (error) {
    throw new Error(`No product Found : ${error.message}`);
  }
});



app.get("/api/excel-data", async (req, res) => {
  try {
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile("./ProductList/file.xlsx");

    const worksheet = workbook.getWorksheet(1);

    const data = [];

    const headerIndices = {};
    worksheet.getRow(1).eachCell({ includeEmpty: false }, (cell, colNumber) => {
      headerIndices[cell.value] = colNumber;
    });

    const headersToExtract = ["seller-sku", "product-id", "price"];

    worksheet.eachRow(
      { includeEmpty: false, firstRow: 2 },
      (row, rowNumber) => {
        const rowData = {};

        headersToExtract.forEach((header) => {
          const colIndex = headerIndices[header];
          rowData[header] = colIndex ? row.getCell(colIndex).value : null;
        });

        data.push(rowData);
      }
    );

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// GET ENTIRE DATA->
app.get('/api/get-all-product-data',async(req,res)=>{
  try {
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile('./ProductList/file.xlsx');
    const worksheet = workbook.getWorksheet(1);

    const data = [];
    const headers = [];

    worksheet.getRow(1).eachCell({includeEmpty:false},(cell)=>{
      headers.push(cell.value);
    })
    worksheet.eachRow({includeEmpty:false,firstRow:2},(row,rowNumber)=>{
      const rowData = {};

      row.eachCell({includeEmpty:false},(cell,colNumber)=>{
        rowData[headers[colNumber-1]] = cell.value;
      })
      data.push(rowData)
    })

   
    res.json(data)

  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal Server Error"});
  }
})


app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
