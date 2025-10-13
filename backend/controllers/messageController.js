import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/configCloudinary.js';

export const getAllContacts = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;
  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select('-password');

  res.status(200).json(filteredUsers);
});

export const getMessagesByUserId = asyncHandler(async (req, res) => {
  const myId = req.user._id;
  const { id: userToChatId } = req.params;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  });

  res.status(200).json(messages);
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  if (!text && !image) {
    res.status(400);
    throw new Error('Text or image is required.');
  }

  if (senderId.equals(receiverId)) {
    res.status(400);
    throw new Error('Cannot send messages to yourself.');
  }

  const receiverExists = await User.exists({ _id: receiverId });
  if (!receiverExists) {
    res.status(404);
    throw new Error('Receiver not found.');
  }

  let imageUrl;
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });
  newMessage.save();
  res.status(201).json(newMessage);
});

export const getChatPartners = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;

  const messages = await Message.find({
    $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
  });

  const chatPartnerIds = [
    ...new Set(
      messages.map((msg) =>
        msg.senderId.toString() === loggedInUserId.toString()
          ? msg.receiverId.toString()
          : msg.senderId.toString()
      )
    ),
  ];

  const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select(
    '-password'
  );

  res.status(200).json(chatPartners);
});
