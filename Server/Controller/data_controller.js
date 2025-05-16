import mongoose from 'mongoose';
import postSchema from '../models/data_model.js';

export async function post (req,res) {
    const {category} = req.body;
    console.log(req.body);

    const files = req.files 

    if(category == 'car') {
        const { brand, carName, year, fuel, transmission, kmDriven, noOfOwners, adTitle, description, price, location,email} = req.body;

        let post = [];

        for(let i=0;i<files.length;i++) {
            post.push(files[i].path)
        }

        const data = await postSchema.create({email, category, postImage:post,brand,description, name:carName, year, fuel, transmission, owner:noOfOwners, title:adTitle, km_driven:kmDriven, price, location: {
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