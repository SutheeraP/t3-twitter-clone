import React from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ModalTweetProps {
  onClose: () => void;
  mode: "create" | "edit";
  tweetId?: number;
  tweetOriginal?: string;
}

export default function ModalTweet({
  onClose,
  mode,
  tweetId,
  tweetOriginal,
}: ModalTweetProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tweetText, setTweetText] = useState(tweetOriginal);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const updateTweet = api.tweet.updateTweet.useMutation({
    onSuccess: async (data) => {
      console.log("Update tweet successfully:", data);
      router.push("/");
      router.refresh();
      setIsSubmitting(false);
      setTweetText("");
      onClose();
    },
    onError: (error) => {
      console.error("Error update tweet:", error.message);
      alert(`Error update tweet: ${String(error)}`);
      throw Error(String(error));
    },
  });

  const createTweet = api.tweet.createTweet.useMutation({
    onSuccess: async (data) => {
      console.log("Create tweet successfully:", data);
      router.push("/");
      router.refresh();
      setIsSubmitting(false);
      setTweetText("");
      onClose();
    },
    onError: (error) => {
      console.error("Error creating tweet:", error.message);
      alert(`Error creating tweet: ${String(error)}`);
      throw Error(String(error));
    },
  });

  const handleSubmit = (formData: FormData) => {
    setIsSubmitting(true);
    const tweetTextVal = formData.get("tweetText") as string;

    if (!tweetTextVal.length) {
      setIsSubmitting(false);
      return alert("Type something 🫵");
    }

    // check mode then mutate
    if (mode == "create") {
      createTweet.mutate({
        text: tweetTextVal,
      });
    } else if (mode == "edit" && tweetId) {
      updateTweet.mutate({
        text: tweetTextVal,
        id: tweetId,
      });
    }
  };

  return (
    <form
      action={handleSubmit}
      className="absolute left-0 top-0 z-10 h-full w-screen md:bg-main md:bg-opacity-10 md:backdrop-blur-sm"
    >
      <div className="mx-auto h-full bg-dark px-4 md:mt-12 md:h-fit md:w-[500px] md:rounded-md">
        {/* top */}
        <div className="flex items-baseline justify-between py-4">
          <div onClick={onClose} className="cursor-pointer">
            Cancel
          </div>
          <div className="flex items-baseline gap-4">
            {/* <div className="text-sm">0 / 240</div> */}
            <button
              // onClick={onClose}
              type="submit"
              disabled={isSubmitting}
              className={`${isSubmitting ? "animate-pulse" : ""} cursor-pointer rounded-md bg-main px-6 py-1 font-semibold text-dark`}
            >
              {mode == "create" ? "Post" : "Save"}
            </button>
          </div>
        </div>
        {/* content */}
        <section className="flex gap-4 pb-6 text-sm md:text-base">
          <div className="relative aspect-square h-12 w-12">
            <Image
              src={user.imageUrl}
              alt="Profile Image"
              fill
              className="rounded-full object-cover"
            />
          </div>

          <textarea
            name="tweetText"
            placeholder="Me a rai?"
            onChange={(e) => {
              setTweetText(e.target.value);
            }}
            value={tweetText}
            className="h-[300px] w-full bg-transparent text-[16px] placeholder:text-slate-500 focus:outline-none"
          ></textarea>
        </section>
      </div>
    </form>
  );
}
