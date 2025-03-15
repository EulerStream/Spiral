import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import Image from "next/image";
import Preview from "/public/_static/home/preview.png";
import Phone from "/public/_static/home/phone.png";

import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {Icons} from "@/components/shared/icons";
import styles from "./preview-landing.module.css";

export default function PreviewLanding() {

  return (
      <div className="pb-6 sm:pb-16">
        <MaxWidthWrapper
            className={"my-20 flex flex-wrap justify-between rounded-xl p-12 md:bg-muted/30 md:ring-1 md:ring-inset md:ring-border"}>
          <div className={"mb-10 inline-block max-w-lg"}>
            <span className="text-gradiant block w-fit font-heading text-xl">EULER DATA</span>
            <span className="mt-3 block w-fit font-heading text-4xl">Elevate Streams With Ease</span>
            <p className={"mt-3 text-lg"}>
              Discover the power of Euler Stream&apos;s real-time data access and how it can help you build custom 3rd-party
              tools & integrations.
              Seamlessly use with open-source libraries to enhance your access to TikTok data. Our dashboard provides a
              smooth, developer-focused experience.
              Use interactive stream data to boost engagement, collection metrics, and innovate.
            </p>
            <br/>
          </div>
          <div style={{position: "relative", width: "50%", flexGrow: "1"}}>
            <Image style={{width: "100%", flexGrow: "1"}} src={Preview} alt={"Preview"}/>
            <a href={"https://www.tiktok.com/@tv_asahi_news/live"} style={{cursor: "pointer"}} target={"_blank"}>
              <Image className={styles.phoneImage} style={{width: "30%", right: "-3%", top: "20%", position: "absolute", cursor: "pointer"}} src={Phone} alt={"Preview"}/>
            </a>
          </div>
        </MaxWidthWrapper>
      </div>
  );
}
