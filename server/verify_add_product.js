import axios from 'axios';
import 'dotenv/config';

const backendUrl = "http://localhost:4000";

async function main() {
  console.log("Starting verification of seller login & product addition...");

  // 1. Seller Login
  const loginRes = await axios.post(`${backendUrl}/api/seller/login`, {
    email: "admin@gmail.com",
    password: "ananyaa123"
  });

  if (!loginRes.data.success) {
    throw new Error("Seller Login failed: " + loginRes.data.message);
  }
  console.log("Seller Login successful, token received:", loginRes.data.token);
  const token = loginRes.data.token;

  // 2. Add Product simulating multipart form-data
  // Since we don't have a real file stream, we can just send standard fields.
  // Wait, does the backend support no files?
  // Let's check: "const files = req.files || [];"
  // Yes, if files is empty, it falls back to a placeholder image.
  // We can send a standard URL-encoded form or multipart/form-data.
  // Let's send a post request with JSON (wait, multer parses multipart/form-data, but since we are using upload.any(), let's make a real multipart/form-data request using FormData, or since we are in node we can use form-data or just send JSON).
  // Wait, if we send JSON, multer might not populate req.body if it expects multipart/form-data, or wait: does Express's express.json() run for JSON requests?
  // Yes, app.use(express.json()) runs for all JSON requests. But wait, productRouter.post('/add', authSeller, upload.any(), addProduct) has upload.any() which is multer. If a request is JSON (application/json), multer does nothing, and express.json() parses it.
  // Let's verify by posting JSON:
  try {
    const addRes = await axios.post(`${backendUrl}/api/product/add`, {
      name: "Verification Organic Onion 1kg",
      description: JSON.stringify(["Sweet and pungent", "Verification product"]),
      category: "Vegetables",
      price: 50,
      offerPrice: 45,
      stock: 15,
      weight: "1kg"
    }, {
      headers: {
        token: token
      }
    });

    console.log("Add Product response:", addRes.data);
    if (addRes.data.success) {
      console.log("SUCCESS: Product added successfully!");
    } else {
      console.error("FAILED: Product addition failed:", addRes.data.message);
    }
  } catch (error) {
    console.error("Add Product threw error:", error.response ? error.response.data : error.message);
  }
}

main().catch(err => {
  console.error("Verification error:", err);
});
