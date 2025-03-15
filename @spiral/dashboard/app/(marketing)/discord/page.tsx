import {RedirectPage} from "@/app/(marketing)/discord/generic-redirect";
import {discord} from "@/config/landing";

export default function DiscordPage() {
  return (
      <section className="mt-10 space-y-6 py-12 sm:py-20 lg:py-20">
        <div className={"p-20"}>
          <RedirectPage url={discord}/>
        </div>
      </section>
  )
}