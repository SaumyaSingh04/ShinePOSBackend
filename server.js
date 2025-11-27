require('dotenv').config();
const express = require("express");
const connectDB = require('./config/database');
const app = express();

connectDB();

app.use(express.json());

app.use("/api/bill", require("./routes/billRoutes"));
app.use("/api/item", require("./routes/itemRoutes"));
app.use("/api/item-category", require("./routes/itemCategoryRoutes"));
app.use("/api/kot", require("./routes/kotRoutes"));
app.use("/api/noc", require("./routes/nocRoutes"));
app.use("/api/notification", require("./routes/notificationRoutes"));
app.use("/api/category", require("./routes/restaurantCategoryRoutes"));
app.use("/api/invoice", require("./routes/restaurantInvoiceRoutes"));
app.use("/api/order", require("./routes/restaurantOrderRoutes"));
app.use("/api/reservation", require("./routes/restaurantReservationRoutes"));
app.use("/api/table", require("./routes/tableRoutes"));
app.use("/api/wastage", require("./routes/wastageRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});