require('dotenv').config();
const express = require("express");
const connectDB = require('./config/database');
const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes/authRoutes"));
app.use("/api/bill", require("./routes/restaurant/billRoutes"));
app.use("/api/item", require("./routes/restaurant/itemRoutes"));
app.use("/api/item-category", require("./routes/restaurant/itemCategoryRoutes"));
app.use("/api/kot", require("./routes/restaurant/kotRoutes"));
app.use("/api/noc", require("./routes/restaurant/nocRoutes"));
app.use("/api/notification", require("./routes/restaurant/notificationRoutes"));
app.use("/api/invoice", require("./routes/restaurant/restaurantInvoiceRoutes"));
app.use("/api/order", require("./routes/restaurant/restaurantOrderRoutes"));
app.use("/api/reservation", require("./routes/restaurant/restaurantReservationRoutes"));
app.use("/api/table", require("./routes/restaurant/tableRoutes"));
app.use("/api/wastage", require("./routes/restaurant/wastageRoutes"));
app.use("/api/restaurant-registration", require("./routes/sales/restaurantRegistrationRoutes"));
app.use("/api/sales-person", require("./routes/sales/salesPersonRoutes"));
app.use("/api/activity-log", require("./routes/sales/activityLogRoutes"));

app.get('/', (req, res) => {
  res.json({ message: 'ShinePOS Backend API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});