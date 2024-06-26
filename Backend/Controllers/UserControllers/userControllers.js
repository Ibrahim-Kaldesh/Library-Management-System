import AppError from "../../util/appError.js";
import { cathcAsync } from "../errorControllers/errorContollers.js";
import userModel from "../../DB/Models/userModel/userModel.js";
import multer from "multer";
import sharp from "sharp";
import bookModel from "../../DB/Models/bookModel/bookModel.js";

export const createUser = cathcAsync(async (req, res, next) => {
  console.log(1);
  if (!Object.entries(req.body).length)
    return next(new AppError("No Data", 400));

  // craete product and add it to products array
  const user = await userModel.create(req.body);

  res.status(201).json({
    status: "Success !!",
    message: "user created successfully",
  });
});

export const showAllUsers = cathcAsync(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).json({
    status: "Success",
    message: "Users showed successfully",
    users,
  });
});

export const removeUser = cathcAsync(async (req, res, next) => {
  await userModel.findByIdAndDelete(req.user._id);

  res.status(203).json({
    status: "Success",
    message: "user deleted successfully",
  });
});

export const updateUserProfile = cathcAsync(async function (req, res, next) {
  const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });

  user.tokens = undefined;

  res.status(200).json({
    status: "Success !!",
    message: "User updated successfully",
    user,
  });
});

export const showUserById = cathcAsync(async (req, res, next) => {
  const user = await userModel.findById(req.params.userId);

  if (!user) return next(new AppError("user not found !!", 404));

  res.status(200).json({
    status: "Success",
    message: "User showed successfully",
    user,
  });
});

export const searchBookRes = cathcAsync(async function (req, res, next) {
  if (req.results.length) {
    return res.status(200).json({
      results: req.results.length,
      status: "success",
      message: "Results showed successfully",
      search: req.search,
      books: req.results,
    });
  }
  res.status(200).json({
    status: "success",
    message: "No results found !!",
    search: req.search,
  });
});

export const searchUserRes = cathcAsync(async function (req, res, next) {
  if (req.results.length) {
    return res.status(200).json({
      results: req.results.length,
      status: "success",
      message: "Results showed successfully",
      search: req.search,
      books: req.results,
    });
  }
  res.status(200).json({
    status: "success",
    message: "No results found !!",
    search: req.search,
  });
});

export const addBook = cathcAsync(async (req, res, next) => {
  const book = await bookModel.findById(req.params.bookId);
  if (!book) return next(new AppError("Book not found !!", 404));

  if (book.users.includes(req.user._id))
    return next(new AppError("Book already exists", 400));

  book.users.push(req.user._id);
  req.user.books.push(book._id);

  await book.save({ validateBeforeSave: false });
  await req.user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "Success !!",
    message: "Book added to your books successfully",
  });
});

export const removeBook = cathcAsync(async (req, res, next) => {
  const book = await bookModel.findById(req.params.bookId);
  if (!book) return next(new AppError("Book not found !!", 404));

  if (!book.users.includes(req.user._id))
    return next(new AppError("Book doesn't exists !!", 400));

  book.users = book.users.filter((id) => {
    return String(id) !== String(req.user._id);
  });
  req.user.books = req.user.books.filter((id) => id != req.params.bookId);

  await book.save({ validateBeforeSave: false });
  await req.user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "Success !!",
    message: "Book removed from your books successfully",
  });
});

export const showAllBooksOfSingleUser = cathcAsync(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("books");

  if (!user) return next(new AppError("user not found !!", 404));

  return res.status(200).json({
    status: "Success !!",
    message: "Books of the user retrieved successfully",
    data: user.books,
  });
});

export const showAllRatingsOfSingleUser = cathcAsync(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("ratings");

  if (!user) return next(new AppError("user not found !!", 404));

  user.tokens = undefined;

  res.status(200).json({
    status: "Success",
    message: "User showed successfully",
    user,
  });
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else
    cb(
      new AppError("Invlaid file format!!, please upload a photo", 400),
      false
    );
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadPicture = upload.single("photo");

export const resizeImage = cathcAsync(async function (req, res, next) {
  req.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`./public/images/${req.filename}`);

  next();
});

// Controllers for any user
export const updateUserPhoto = cathcAsync(async function (req, res, next) {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { profilePhoto: req.filename },
    { new: true, runValidators: true }
  );

  user.tokens = undefined;

  res.status(200).json({
    user,
    status: "success",
    message: "Photo uploaded successfully.",
  });
});
