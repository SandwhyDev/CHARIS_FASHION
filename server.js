import express from "express";
import cors from "cors";
import env from "dotenv";
import cookieParser from "cookie-parser";
import user_controller from "./controller/user_controller";
import profile_controller from "./controller/profile_controller";
import categories_controller from "./controller/categories_controller";
import sub_categories_controller from "./controller/sub_categories_controller";
import product_controller from "./controller/product_controller";
import product_review_controller from "./controller/product_review_controller";
import discount_controller from "./controller/discount_controller";
import order_controller from "./controller/order_controller";
import payment_controller from "./controller/payment_controller";
import auth from "./controller/auth";
import moment from "moment";
import product_image_controller from "./controller/product_images_controller";
import avatar_user_controller from "./controller/avatar_user_controller";

env.config();

const app = express();
const PORT = process.env.PORT;
const time = moment().format("LTS");

//middleware
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//routes
app.use("/api", user_controller);
app.use("/api", avatar_user_controller);
app.use("/api", profile_controller);
app.use("/api", categories_controller);
app.use("/api", sub_categories_controller);
app.use("/api", product_controller);
app.use("/api", product_image_controller);
app.use("/api", product_review_controller);
app.use("/api", discount_controller);
app.use("/api", order_controller);
app.use("/api", payment_controller);
app.use("/api", auth);

//listener
app.listen(PORT, () => {
  console.log(`
    

    > LISTENED TO PORT ${PORT} 

    >> waktu : ${time}

    `);
});
