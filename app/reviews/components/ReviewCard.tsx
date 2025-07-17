"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

interface Review {
  id: string;
  title: string;
  content: string;
  author: string;
  region: string;
  rating: number;
  images: string[];
  createdAt: string;
  likes: number;
  category: string;
}

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(review.likes);

  const handleLike = () => {
    if (isLiked) {
      setLikesCount((prev) => prev - 1);
    } else {
      setLikesCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      nature: "자연",
      culture: "문화",
      food: "맛집",
      history: "역사",
      activity: "액티비티",
    };
    return categories[category] || category;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* 이미지 */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={review.images[0]}
          alt={review.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            {review.region}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-pink-500/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-white">
            {getCategoryName(review.category)}
          </span>
        </div>
      </div>

      {/* 내용 */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="flex text-yellow-400 mr-2">
              {Array.from({ length: 5 }, (_, i) => (
                <i
                  key={i}
                  className={`ri-star${
                    i < review.rating ? "-fill" : "-line"
                  } text-sm`}
                ></i>
              ))}
            </div>
            <span className="text-sm text-gray-600">{review.rating}</span>
          </div>
          <span className="text-xs text-gray-500">
            {formatDate(review.createdAt)}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
          {review.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {review.content}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">
                {review.author.charAt(0)}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {review.author}
            </span>
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors cursor-pointer ${
              isLiked
                ? "bg-pink-100 text-pink-600"
                : "bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-500"
            }`}
          >
            <i className={`ri-heart${isLiked ? "-fill" : "-line"} text-sm`}></i>
            <span className="text-xs font-medium">{likesCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
