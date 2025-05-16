// import mongoose from 'mongoose';
import postSchema from '../models/data_model.js';
// import transporter from '../Middleware/Offer.js';

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: "a4fb74bc6a9a15",
    pass: "60ee9c9281a9d6",
  },
});

export async function post (req,res) {

    const {category} = req.body;
    console.log(req.body);
    const files = req.files 

    if(category == 'car') {
        const { brand, carName, year, fuel, transmission, kmDriven, noOfOwners, adTitle, description, price, location,email,profilePicture} = req.body;

        let post = [];

        for(let i=0;i<files.length;i++) {
            post.push(files[i].path)
        }

        const data = await postSchema.create({profilePicture,email, category, postImage:post,brand,description, name:carName, year, fuel, transmission, owners:noOfOwners, title:adTitle, km_driven:kmDriven, price, location: {
            state:location.state,
            district:location.district,
            city:location.city
        }})

        res.status(200).json({message:'successfully added Your Ad'})
    }
}

export async function load (req,res) {
    const ads = await postSchema.find();

    if(ads) {
        res.status(200).json({ads:ads})
    }
}

export async function preview (req,res) {
    const id = req.params.id
    const preview_data = await postSchema.findById(id);

    if(preview_data) {
        res.status(200).json(preview_data)
    }
}

  export async function like(req, res) {

  try {
    const id = req.params.id;
    console.log(id);
    const {email} = req.body;

    console.log(email);
    const post = await postSchema.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.like.includes(email)) {
      post.like = post.like.filter(userEmail => userEmail !== email);
      await post.save();
      return res.status(200).json({ message: "User disliked the post", post });
    } else {
      post.like.push(email);
      await post.save();
      return res.status(200).json({ message: "liked the post", post });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function offer(req, res) {

  // console.log("inside offer");
  // console.log(req.query);

  // const sellerMail = req.query.sellerMail;
  // const buyerMail = req.query.buyerMail;
  // const brand = req.query.brand;
  // const name = req.query.name;
  // const price = req.query.price;
  // const offer = req.query.offer;
  // const state = req.query.state;
  // const district = req.query.district;
  // const city = req.query.city

  //   const info1 = await transporter.sendMail({
  //   from: sellerMail,
  //   to: buyerMail,
  //   subject: 'OLX Offer Acceptance Confirmation',
  //   text: `Thank you for your offer on OLX. Your offer for "${name}" has been accepted.`,
  //   html: `
  //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
  //       <!-- Header -->
  //       <div style="background-color: #007bff; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0;">
  //         <h1 style="margin: 0; font-size: 24px;">Offer Accepted on OLX</h1>
  //       </div>

  //       <div style="padding: 20px;">
  //         <p style="font-size: 16px; color: #333;">
  //           Hello <strong>${buyerMail.split('@')[0]}</strong>,
  //         </p>
  //         <p style="font-size: 16px; color: #333;">
  //           We are pleased to inform you that your offer for the product listed on OLX has been accepted by the seller.
  //         </p>

  //         <h2 style="font-size: 18px; color: #333; margin-top: 20px;">Product Details</h2>
  //         <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
  //           <tr>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;"><strong>Product Name</strong></td>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;">${name}</td>
  //           </tr>
  //           <tr>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;"><strong>Product Name</strong></td>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;">${brand}</td>
  //           </tr>
  //           <tr>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;"><strong>Original Price</strong></td>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;">₹${price.toLocaleString()}</td>
  //           </tr>
  //           <tr>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;"><strong>Offer Price</strong></td>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;">₹${offer.toLocaleString()}</td>
  //           </tr>
  //           <tr>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;"><strong>Location</strong></td>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;">${state}, ${district}, ${city}</td>
  //           </tr>
  //         </table>

  //         <p style="font-size: 16px; color: #333; margin-top: 20px;">
  //           Please contact the seller at <a href="mailto:${sellerMail}" style="color: #007bff; text-decoration: none;">${sellerMail}</a> to finalize the transaction details.
  //         </p>
  //       </div>

  //       <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
  //         <p style="font-size: 14px; color: #666; margin: 0;">
  //           This is an automated message from OLX. Please do not reply directly to this email.
  //         </p>
  //         <p style="font-size: 14px; color: #666; margin: 5px 0;">
  //           &copy; ${new Date().getFullYear()} OLX. All rights reserved.
  //         </p>
  //       </div>
  //     </div>
  //   `,
  // });

  // console.log("Message sent: %s", info1.messageId);


  // const info2 = await transporter.sendMail({
  //   from: buyerMail, 
  //   to: sellerMail,
  //   subject: 'New Offer for Your Product on OLX',
  //   text: `Hello, I have made an offer for your product "${name}" on OLX. Please contact me at ${buyerMail} to discuss further.`,
  //   html: `
  //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
  //       <!-- Header -->
  //       <div style="background-color: #007bff; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0;">
  //         <h1 style="margin: 0; font-size: 24px;">New Offer on OLX</h1>
  //       </div>

  //       <div style="padding: 20px;">
  //         <p style="font-size: 16px; color: #333;">
  //           Hello Seller,
  //         </p>
  //         <p style="font-size: 16px; color: #333;">
  //           I’m interested in your product listed on OLX and have submitted an offer. I’d love to discuss further details with you.
  //         </p>

  //         <h2 style="font-size: 18px; color: #333; margin-top: 20px;">Product Details</h2>
  //         <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
  //           <tr>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;"><strong>Product Name</strong></td>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;">${name}</td>
  //           </tr>
  //           <tr>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;"><strong>Product Name</strong></td>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;">${brand}</td>
  //           </tr>
  //           <tr>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;"><strong>Original Price</strong></td>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;">₹${price.toLocaleString()}</td>
  //           </tr>
  //           <tr>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;"><strong>Offer Price</strong></td>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;">₹${offer.toLocaleString()}</td>
  //           </tr>
  //           <tr>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;"><strong>Location</strong></td>
  //             <td style="padding: 8px; font-size: 14px; color: #333; border-bottom: 1px solid #e0e0e0;">${state}, ${district}, ${city}</td>
  //           </tr>
  //         </table>

  //         <p style="font-size: 16px; color: #333; margin-top: 20px;">
  //           Please contact me at <a href="mailto:${buyerMail}" style="color: #007bff; text-decoration: none;">${buyerMail}</a> to finalize the transaction or discuss further.
  //         </p>
  //       </div>

  //       <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
  //         <p style="font-size: 14px; color: #666; margin: 0;">
  //           This is an automated message from OLX. Please do not reply directly to this email.
  //         </p>
  //         <p style="font-size: 14px; color: #666; margin: 5px 0;">
  //           © ${new Date().getFullYear()} OLX. All rights reserved.
  //         </p>
  //       </div>
  //     </div>
  //   `,
  // });

  // console.log("Message sent: %s", info2.messageId);
}