import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {Icons} from "@/components/shared/icons";
import {discord, discordGuildId} from "@/config/landing";
import OnlineDevelopers from "@/components/home/online-developers";
import {LucideHammer} from "lucide-react";

export default async function HeroLanding() {

  return (
    <section className="mt-10 space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <Link
          href={discord}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-4",
          )}
          target="_blank"
        >
          <span className={"mr-3"}>💻</span>
          <span className="hidden md:flex"><OnlineDevelopers guildId={discordGuildId} /></span>
           <Icons.discord className="ml-2 size-4" />
        </Link>
        <div className={'mt-20'}>
          <div
              className="flex cursor-pointer space-x-2 md:space-x-4"
              style={{animationDelay: "0.4s", animationFillMode: "forwards"}}
          >
            <Link
                href="/dashboard"
                prefetch={true}
                className={cn(
                    buttonVariants({size: "lg", rounded: "full"}),
                    "gap-2",
                )}
            >
              <span>Dashboard</span>
              <Icons.arrowRight className="size-4"/>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
