import { useEffect, useState } from "react";
import { API_URL } from "../config/config";

const SingleComment = ({ comment }) => {
  const [from, setFrom] = useState("Loading...");

  useEffect(() => {
    if (!comment?.from) return;

    const fetchFrom = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/profile/${comment.from}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (res.ok && data?.profile?.name) {
          setFrom(data.profile.name);
        } else {
          setFrom("Unknown");
        }
      } catch (err) {
        console.error("Failed to fetch profile: ", err.message);
        setFrom("Unknown");
      }
    };

    fetchFrom();
  }, [comment?.from]);

  if (!comment) return null; // 🚀 Prevents crashes if comment is undefined

  return (
    <li
      key={comment._id || Math.random()} // fallback if _id missing
      className="bg-gray-50 p-3 rounded-md mb-2 border border-gray-100"
    >
      <strong className="text-gray-800">{from || "Unknown"}:</strong>{" "}
      <span className="text-gray-700">{comment?.message || ""}</span>
      <span className="text-gray-500 text-xs ml-2">
        •{" "}
        {comment?.createdAt
          ? new Date(comment.createdAt).toLocaleString()
          : "just now"}
      </span>
    </li>
  );
};

export default SingleComment;