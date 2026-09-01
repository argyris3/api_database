"use client";
import {
  RocketIcon,
  ShapesIcon,
  ThumbsUpIcon,
  HardDrive,
  BookHeart,
  DatabasePlus,
  KeySquare,
} from "lucide-react";

import Navbar from "@/components/navbar";

export const featuresData = [
  {
    icon: DatabasePlus,
    title: "Postgres Database",
    description:
      "Every project is a full Postgres database.Portable,extensible and ready to query...",
  },
  {
    icon: ThumbsUpIcon,
    title: "JavaScript SDK",
    description:
      "Query your backend from any app with the official ta_data_mas client library...",
  },
  {
    icon: KeySquare,
    title: "Authentication",
    description:
      "Add user sign ups and logins.Email,magic link and OAuth providers built in...",
  },
  {
    icon: RocketIcon,
    title: "Realtime",
    description: "Built multiplayer experiences with real-time data sync...",
  },
  {
    icon: HardDrive,
    title: "Storage",
    description:
      "Store,organize and serve large files --from avatars to large video files...",
  },
  {
    icon: BookHeart,
    title: "Data APIs",
    description:
      "Instant ready-to-use REST APIs for every table in your project...",
  },
];

// import { useEffect, useState } from "react";

export default function Home() {
  // const [status, setStatus] = useState("checking...");

  // useEffect(() => {
  //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
  //     .then((r) => r.json())
  //     .then((data) => setStatus(data.status))
  //     .catch(() => setStatus("unreachable"));
  // }, []);

  return (
    <main className=" bg-slate-300">
      <nav className="mt-2">
        <Navbar />
      </nav>
      <div className="flex items-center gap-4 flex-col mt-10">
        <h1 className=" text-2xl/5 md:text-[44px]/10 font-semibold max-w-2xl italic  text-center">
          Build your own database with{" "}
          <span className="text-blue-400  ">ta_data_mas</span>
        </h1>
        <p className="text-base dark:text-slate-300 max-w-lg ">
          Start your project with a Postgres database,Add Authentication,Data
          APIs,Realtime,Storage,and a Javascript SDK --all from one dashboard...
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-10 px-6 md:px-16 lg:px-24 xl:px-32">
        {featuresData.map((feature, index) => (
          <div
            key={index}
            className="p-3 rounded-xl space-y-3 border border-slate-200 dark:border-slate-800 bg-blue-100 dark:bg-slate-800/20 max-w-80 md:max-w-66"
          >
            <feature.icon
              className="text-slate-500 size-8 mt-4"
              strokeWidth={1.3}
            />
            <h3 className="text-base font-medium">{feature.title}</h3>
            <p className="text-slate-700 line-clamp-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </main>
    // <main className="flex min-h-screen flex-col items-center justify-center p-24">
    //   <h1 className="text-4xl font-bold italic">ta_data_mas</h1>
    //   <p className="mt-4 text-gray-500">API status: {status}</p>
    // </main>
  );
}
