"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleMessage = async () => {};
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-10 container mx-auto pl-4 pt-6 pr-4">
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            await handleMessage();
          }
        }}
        className="input input-bordered w-full m-10"
      />
    </div>
  );
}
