import express from 'express';
import nodemailer from 'nodemailer';
import * as dotenv from "dotenv";
import { check, validationResult } from 'express-validator';

dotenv.config();
const router = express.Router();

  export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  export default router.post("/contact", [
    check('name')
      .notEmpty()
      .withMessage('Name cannot be empty')
      .isLength({ min: 3, max: 30 })
      .withMessage('Name must be at least 3 and less than 30 characters'),
  
    check('email')
      .notEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Email must be valid email address')
      .isLength({ min: 5, max: 50 })
      .withMessage('Email must be at least 5 characters and less than 50 characters')
      .normalizeEmail(),

    check('message')
      .notEmpty()
      .withMessage('Message field cannot be empty')
      .isLength({ max: 255 })
      .withMessage('Message needs to be less than 255 characters')
      .trim()
      .escape(),
  ], (req, res) => {
  
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }


    var name = req.body.name;
    var email = req.body.email;
    var subject = req.body.subject;
    var message = req.body.message;
    var content = `name: ${name} \n email: ${email} \n subject: ${subject} \n message: ${message} `;
    var mail = {
      from: name,
      to: 'davidhanlon23@gmail.com',
      subject: subject,
      text: content
    }
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        res.status(400).json({
          status: 'fail'
        })
      } else {
        res.status(200).json({
         status: 'success'
        })
      }
    })
  });