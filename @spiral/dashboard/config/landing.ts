import {PlatformLdg, InfoLdg, TestimonialType} from "types";
import * as process from "node:process";

export const discordGuildId: string = process.env.NEXT_PUBLIC_DISCORD_GUILD_ID || ""
export const discord: string = process.env.NEXT_PUBLIC_DISCORD || ""

export const platforms: PlatformLdg[] = [
  {
    title: "YouTubeLive",
    description:
        "Access YouTube livestreams in real-time with the YouTubeLive library. Get started today!",
    link: "https://github.com/isaackogan/YouTubeLive",
    icon: "youtube",
  },
  {
    title: "TwitchLive",
    description:
        "Access unlimited Twitch livestream in real-time with the TwitchLive library. Pretty sick, if we do say so ourselves. And we do.",
    link: "https://github.com/isaackogan/TwitchLive",
    icon: "twitch",
  },
  {
    title: "TikTok-Live-Connector (Node.JS)",
    description:
        "Created by ZerodyOne, this library allows you to access TikTok data in real-time using Node.JS. Get started today!",
    link: "https://github.com/zerodytrash/TikTok-Live-Connector",
    icon: "tiktok",
  },
  {
    title: "TikTokLiveJava",
    description:
        "Made by jwdeveloper and kohlerpop1 on GitHub, this Java library allows you to access TikTok data in real-time. Get started today!",
    link: "https://github.com/jwdeveloper/TikTokLiveJava",
    icon: "tiktok",
  },
  {
    title: "TikTokLive (Python)",
    description:
        "Access TikTok data in real-time with the Python library. Get started with the easy-to-use API and comprehensive documentation.",
    link: "https://github.com/isaackogan/TikTokLive",
    icon: "tiktok",
  },
  {
    title: "TikTokLiveSharp",
    description:
        "Made by frankvHoof93, this C# and Unity library allows you to integrate TikTok into custom games.",
    link: "https://github.com/frankvHoof93/TikTokLiveSharp",
    icon: "tiktok",
  },
  {
    title: "TikTokLiveRust",
    description:
        "Why not re-code it in rust? That's the sentiment jwdeveloper went with in this library. Get started today!",
    link: "https://github.com/jwdeveloper/TikTokLiveRust",
    icon: "tiktok",
  },
  {
    title: "GoTikTokLive",
    description:
        "Write a microservice or two easily with the GoTikTokLive library. Small but might. Get started today!",
    link: "https://github.com/Davincible/gotiktoklive",
    icon: "tiktok",
  }
];

export const testimonials: TestimonialType[] = [
  {
    name: "Alex Bowles",
    job: "Founder @ CasterLabs",
    image: "/_static/testimonials/casterlabs.png",
    review:
        "TikTokLive has been a life saver for accessing live data from TikTok. They've been super stable and the team over there is great!"
  },
  {
    name: "Gabriel Mendes",
    job: "Data Analyst",
    image: "/_static/testimonials/blank.png",
    review:
        "Thanks to TikTokLive, I was able to create a business where I sold TikTok-Minecraft interactions, allowing users to control the streaming gameplay sending gifts, and with comments, likes, subs, follows..."
  },
  {
    name: "Herman Condori",
    job: "Software Engineer",
    image: "/_static/testimonials/blank.png",
    review:
        "Thanks to the TikTokLive API, I was able to create applications and add-ons to enhance my stream, as well as share the example projects I've completed to also assist other streamers who require additional tools to create and improve their streams, in order to better entertain their audience."
  },
  {
    name: "vls",
    job: "Founder @ vls",
    image: "/_static/testimonials/blank.png",
    review:
        "Thanks to TikTokLive, I've been able to create robust, versatile, and seamless TikTok interactions, and transmit that data in-game in real-time! TikTokLive is truly the core of our business."
  },
];
