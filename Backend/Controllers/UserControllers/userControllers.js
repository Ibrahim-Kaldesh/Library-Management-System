import { readFromJson, writeToJson } from "../../helpers/readAndWrite.js";
import { findBookById, finduserById } from "../../helpers/searchById.js";

const users = readFromJson("./data/users.json");
const books = readFromJson("./data/books.json");

export const createUser = function (req, res, next) {
  try {
    if (!req.body) throw new Error("No Data !!");

    // craete product and add it to products array
    const user = req.body;
    users.push(user);

    // update json file with new data
    writeToJson("./data/users.json", users);

    res.status(201).json({
      status: "Success !!",
      message: "user created successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: "fail !!",
      message: e.message,
    });
  }
};

export const showAllUsers = function (req, res, next) {};

export const removeUser = function (req, res, next) {};
export const showUserById = function (req, res, next) {};

export const addBook = function (req, res, next) {
  try {
    const user = finduserById(users, req);
    if (!user)
      return res.status(404).json({
        status: "fail",
        message: "user not found !!",
      });

    const book = findBookById(books, req);
    if (!book)
      return res.status(404).json({
        status: "fail",
        message: "book not found !!",
      });

    if (book.users.includes(user.id))
      return res.status(400).json({
        status: "fail",
        message: "Book already exists",
      });

    book.users.push(user.id);
    user.books.push(book.id);

    // update json file with new data
    writeToJson("./data/users.json", users);
    writeToJson("./data/books.json", books);

    res.status(200).json({
      status: "Success !!",
      message: "Book added to your books successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: "fail !!",
      message: e.message,
    });
  }
};

export const removeBook = function (req, res, next) {
  try {
    const user = finduserById(users, req);
    if (!user)
      return res.status(404).json({
        status: "fail",
        message: "user not found !!",
      });

    const book = findBookById(books, req);
    if (!book)
      return res.status(404).json({
        status: "fail",
        message: "book not found !!",
      });

    if (!book.users.includes(user.id))
      return res.status(400).json({
        status: "fail",
        message: "Book doesn't exists",
      });

    book.users = book.users.filter((id) => id !== +req.params.userId);
    user.books = user.books.filter((id) => id !== +req.params.bookId);

    // update json file with new data
    writeToJson("./data/users.json", users);
    writeToJson("./data/books.json", books);

    res.status(200).json({
      status: "Success !!",
      message: "Book removed from your books successfully",
    });
  } catch (e) {
    res.status(400).json({
      status: "fail !!",
      message: e.message,
    });
  }
};
