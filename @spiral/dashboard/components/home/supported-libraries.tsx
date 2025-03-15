import Link from "next/link";

import { platforms } from "@/config/landing";
import { Button } from "@/components/ui/button";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function SupportedLibraries() {
  return (
    <section>
      <div className="pb-6 pt-28">
        <MaxWidthWrapper>
          <HeaderSection
            label="Recommended Libraries"
            title="Discover our favourite libraries."
            subtitle="Building livestream integrations has never been easier. Check out some 3rd-party libraries we recommend."
          />

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {platforms.map((feature) => {
              const Icon = Icons[feature.icon || "nextjs"];
              return (
                <div
                  className="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"
                  key={feature.title}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-orange-300/80 to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"
                  />

                  <div className="relative">
                    <div className={"flex content-center justify-between align-middle"} style={{alignItems: "center"}}>
                      <div
                          className="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6">
                        <Icon/>
                      </div>

                      <h4 className={"text-brand font-bold"}>{feature.title}</h4>

                    </div>


                    <p className="mt-6 pb-6 text-muted-foreground">
                      {feature.description}
                    </p>

                    <div className="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7">
                      <Button
                        variant="secondary"
                        size="sm"
                        rounded="xl"
                        className="px-4"
                      >
                        <Link href={feature.link} className="flex items-center gap-2" target={"_blank"}>
                          <span>GitHub Repository</span>
                          <Icons.arrowUpRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  );
}
