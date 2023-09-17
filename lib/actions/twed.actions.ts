"use server";

import { auth } from "@clerk/nextjs";
import Tweds from "../models/twed.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createTweds({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

    const createdTweds = await Tweds.create({
      text,
      author,
      communityId: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { tweds: createdTweds._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating Tweds ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch the POst that have no parents
  const postsQuery = Tweds.find({ parentId: { $in: [null, undefined] } })
    .sort({
      createdAt: "desc",
    })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostsCount = await Tweds.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchTwedsById(id: string) {
  connectToDB();

  try {
    const tweds = await Tweds.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "author",
            model: Tweds,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return tweds;
  } catch (error: any) {
    throw new Error(`Error fetching tweds: ${error.message}`);
  }
}

export async function addCommentToTwed(
  twedsId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    const originaltweds = await Tweds.findById(twedsId);

    if (!originaltweds) {
      throw new Error("Thread not found");
    }

    const commentTwed = new Tweds({
      text: commentText,
      author: userId,
      parentId: twedsId,
    });

    const savedCommentTwed = await commentTwed.save();

    // Add the comment thread's ID to the original thread's children array
    originaltweds.children.push(savedCommentTwed._id);

    // Save the updated original thread to the database
    await originaltweds.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to twed: ${error.message}`);
  }
}
