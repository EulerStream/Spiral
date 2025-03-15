import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import {siteConfig} from "@/config/site";

export default function Privacy() {
  const orgName = siteConfig.name;
  const orgEmail = siteConfig.mailSupport;

  return (
      <div className="pb-6 sm:pb-16">
        <MaxWidthWrapper
            className={"termsPage mb-20 mt-5 rounded-xl p-12 md:bg-muted/30 md:ring-1 md:ring-inset md:ring-border"}>
          <h1 className={"text-4xl font-bold"}>Privacy Policy</h1>
          <br/>

          <p>
            By using thise website & the tiktok.eulerstream.com API (&quot;The Service&quot;), you are agreeing
            to be bound by the following privacy policy (&quot;Privacy Policy&quot;). IF YOU DO NOT AGREE WITH THE TERMS
            OF THE PRIVACY POLICY, YOU MUST NOT ACCEPT
            MAY NOT USE THE SERVICE.
          </p>

          <p>
            {orgName} takes your privacy seriously. To better protect your privacy we provide this privacy policy notice
            explaining the way your personal information is collected and used.
          </p>

          <h2 className={"text-3xl font-bold"}>1. Collection of Routine Information</h2>

          <p>
            The Service tracks basic information about its users. This
            information includes, but is not limited to, IP addresses, browser details, timestamps and referring pages.
            None of this
            information can personally identify specific user of The Service. The information is tracked for routine
            administration and maintenance purposes.
          </p>

          <h2 className={"text-3xl font-bold"}>2. Cookies</h2>

          <p>
            Where necessary, this The Service uses cookies to store information about a visitor’s preferences and
            history
            in order to better serve the user and/or present the user with customized content.
          </p>

          <h2 className={"text-3xl font-bold"}>3. Advertisement and Other Third Parties</h2>

          <p>
            Advertising partners and other third parties may use cookies, scripts and/or web beacons to track user
            activities on The Service in order to display advertisements and other useful
            information. Such tracking is done directly by the third parties through their own servers and is subject to
            their own privacy policies. The Service has no access or control over these cookies, scripts
            and/or web beacons that may be used by third parties. Learn how to [opt out of Google’s cookie
            usage](http://www.google.com/privacy_ads.html).
          </p>

          <h2 className={"text-3xl font-bold"}>4. Links to Third Party Websites</h2>

          <p>
            We have included links on this website for your use and reference. We
            are not responsible for the privacy policies on these websites. You should be aware that the privacy
            policies
            of these websites may differ from our own.
          </p>

          <h2 className={"text-3xl font-bold"}>5. Security</h2>

          The security of your personal information is important to us, but remember that no method of
          transmission over the Internet, or method of electronic storage, is 100% secure. While we strive
          to use commercially acceptable means to protect your personal information, we cannot guarantee
          its absolute security.

          <h2 className={"text-3xl font-bold"}>6. Changes To This Privacy Policy</h2>

          This Privacy Policy is effective as of Wed. August 21st, 2024 and will remain in effect except with respect to
          any changes
          in its provisions in the future, which will be in effect immediately after being posted on this page.

          We reserve the right to update or change our Privacy Policy at any time and you
          should check this Privacy Policy periodically. If we make any material changes to this Privacy
          Policy, they will be reflected here.

          <h2 className={"text-3xl font-bold"}>7. Contact Us</h2>

          <p>
            For any questions or concerns regarding the privacy policy, please send us an email to {orgEmail}.
          </p>

        </MaxWidthWrapper>
      </div>
  )
}