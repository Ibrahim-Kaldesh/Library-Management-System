import express from "express";
import {
  addBook,
  createUser,
  removeBook,
  showAllUsers,
  showAllBooksOfSingleUser,
  showUserById,
  removeUser,
  showAllRatingsOfSingleUser,
  updateUserProfile,
} from "../../Controllers/UserControllers/userControllers.js";
import {
  uploadPicture,
  resizeImage,
  updateUserPhoto,
} from "../../Controllers/UserControllers/userControllers.js";

import {
  signIn,
  signUp,
  logOut,
  changePassword,
} from "../../MiddleWare/Authentication/userAuthentication.js";

import { userAuth } from "../../MiddleWare/Authentication/userAuthentication.js";
import { admiAuth } from "../../MiddleWare/Authentication/adminAuthentication.js";

const userRouter = express.Router();

// Routes allowed for any user
userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);

// Authenticaion Middleware
userRouter.use(userAuth);

userRouter.post("/changepassword", changePassword);
userRouter.get("/logout", logOut);

userRouter.route("/").get(showAllUsers).post(createUser);
userRouter
  .route("/:userId")
  .get(showUserById)
  .delete(removeUser)
  .patch(updateUserProfile);

userRouter.get("/addBook/:bookId", addBook);
userRouter.delete("/removeBook/:bookId", removeBook);

userRouter.get("/showAllbooks", showAllBooksOfSingleUser);
userRouter.get("/showAllRatings", showAllRatingsOfSingleUser);

userRouter.post(
  "/uploadprofilepicture",
  uploadPicture,
  resizeImage,
  updateUserPhoto
);

// Routes allowed only for admins

// Authorization Middleware -> but we use authentication middleware above ...
userRouter.use(admiAuth("admin"));

userRouter.route("/").get(showAllUsers).post(createUser).delete(removeUser);
userRouter.get("/:id", showUserById);

export default userRouter;