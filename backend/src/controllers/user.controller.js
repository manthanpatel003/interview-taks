import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient.js";
import { FRONTEND_URL, JWT_SECRET } from "../config.js";
import { mailEmailVerification } from "../utils/mailUtils.js";

const roleEnum = {
  admin: "ADMIN",
  customer: "CUSTOMER",
};

const userControllers = {
  registerUser: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const { userType } = req.params;

      if (!firstName || !lastName || !email || !password || !userType) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Please fill in all fields" });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });

      console.log(
        "existingUser && existingUser.isVerified",
        existingUser && existingUser.isVerified
      );

      if (existingUser && existingUser.isVerified) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "User already exists" });
      }

      if (existingUser && !existingUser.isVerified) {
        await prisma.user.delete({ where: { email } });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          hashedPassword,
          role: roleEnum[userType],
          isVerified: false,
        },
      });

      if (!newUser) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "User registration failed" });
      }

      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      const mail = await mailEmailVerification(
        `${FRONTEND_URL}/verify/${token}`,
        email
      );

      if (!mail) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message:
            "Failed to send verification email. Please try registering again.",
        });
      }

      res.status(StatusCodes.CREATED).json({
        message:
          "Registration successful! Please check your email for verification link.",
        user: newUser,
      });
    } catch (error) {
      console.log(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Please fill in all fields" });
      }

      const user = await prisma.user.findUnique({ where: { email } });

      if (user && user?.role !== roleEnum.admin) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "You are not allowed to login from here" });
      } else if (!user) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid email or password" });
      } else if (!user.isVerified) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Please verify your email before logging in" });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.hashedPassword
      );
      if (!isPasswordValid) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ message: "Login successful", user, token });
    } catch (error) {
      console.log(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  },
  verifyUser: async (req, res) => {
    try {
      const { token } = req.params;

      if (!token) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Verification token is required" });
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const user = await prisma.user.update({
          where: { id: userId },
          data: { isVerified: true },
        });

        if (!user) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "User not found" });
        }

        res.status(StatusCodes.OK).json({
          message: "User verified successfully",
          user,
        });
      } catch (tokenError) {
        if (tokenError.name === "TokenExpiredError") {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Verification link has expired. Please register again.",
          });
        }
        throw tokenError;
      }
    } catch (error) {
      console.log(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  },
};

export default userControllers;
