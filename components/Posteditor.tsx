"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase.js";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function PostEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("posts").insert({
      title,
      contents: content,
      user_id: user?.id,
    });

    setSaving(false);
    if (error) {
      alert("저장 실패: " + error.message);
    } else {
      alert("저장 완료!");
      router.push("/posts");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-xl font-bold px-4 py-2 border rounded"
        placeholder="제목"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="h-64 px-4 py-2 border rounded resize-none"
        placeholder="내용을 입력하세요"
      />
      <button
        type="submit"
        disabled={saving}
        className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
      >
        {saving ? "저장 중..." : "출간하기"}
      </button>
    </form>
  );
}
