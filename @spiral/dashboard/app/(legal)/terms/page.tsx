import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import {siteConfig} from "@/config/site";

export default function Terms() {
  const orgName = siteConfig.name;
  const orgEmail = siteConfig.mailSupport;

  return (
      <div className="pb-6 sm:pb-16">
        <MaxWidthWrapper
            className={"termsPage mb-20 mt-5 rounded-xl p-12 md:bg-muted/30 md:ring-1 md:ring-inset md:ring-border"}>
          <h1 className={"text-4xl font-bold"}>Terms of Service</h1>
          <br/>
          <p>
            By using this web site and the tiktok.eulerstream.com API (&quot;Service&quot;), you are agreeing
            to be bound by the following terms and conditions (&quot;Terms of Use&quot;). IF YOU DO NOT AGREE WITH THESE
            TERMS AND CONDITIONS, YOU MUST NOT ACCEPT
            THIS AGREEMENT AND MAY NOT USE THE SERVICE. Violations of any of the terms below will result in the
            termination of
            your Account. You agree to use the Service at your own risk.
          </p>
          <h2 className={"text-3xl font-bold"}>1. Account Terms</h2>
          <p>
            1.1 Your user account may only be used by one Organization. A single account shared
            by Organizations is not permitted. Registration of a user account is
            free so please create as many user accounts as necessary for your
            productive use of the Service. An Organization is defined as a company or other association of 2 or more
            people.
          </p>
          <p>
            1.2 You are responsible for maintaining the security of your username
            and password. {orgName} cannot and will not be liable
            for any loss or damage from your failure to comply with this security
            obligation.
          </p>
          <p>
            1.3 You must not use the Service to carry on any illegal or unauthorized
            activities (including but not limited to copyright, trademark
            infringements, or spam of TikTok).
          </p>
          <p>
            1.4 You may not create multiple accounts. Creating multiple accounts will result
            in the termination of all accounts, and a permanent ban from the Service.
            One account is allowed per Organization.
          </p>
          <p>
            1.5 You may not violate TikTok copyright. You will be banned from the Service if
            you are reported to have violated TikTok or TikTok creators&quot; copyright.
          </p>
          <h2 className={"text-3xl font-bold"}>2. Payment and Refunds</h2>
          <p>
            2.1 Beyond the public free limits, you must enter a valid credit card
            to pay the monthly balance due on an Organization&apos;s account.
          </p>

          <p>
            2.2 There will be no refunds for payments of the monthly usage charges.
          </p>

          <h2 className={"text-3xl font-bold"}>3. Cancellation and Termination</h2>

          <p>
            3.1 You are solely responsible for properly canceling accounts. An email
            or phone request to cancel an account is not considered cancellation.
            You can cancel an account at any time by clicking on the associated
            &quot;Delete&quot; button. It is a simple no questions asked cancellation
            procedure.
          </p>

          <p>
            3.2 If you decide to delete an Account, all of the Content associated with
            that Account will be immediately deleted from the Service. This information
            can not be recovered once it has been deleted.
          </p>

          <p>
            3.3 {orgName}, in its sole discretion, has the right to suspend
            or terminate an Account at any time.
          </p>

          <p>
            3.4 {orgName} reserves the right to refuse service to anyone
            for any reason at any time.
          </p>

          <h2 className={"text-3xl font-bold"}>4. Copyright and Content Ownership</h2>

          <p>
            4.1 We claim no intellectual property rights over the material you provide
            to the Service. Your materials uploaded remain yours.
          </p>

          <p>
            4.2 You shall defend {orgName} against any claim, demand,
            suit or proceeding made or brought against {orgName}
            that Your Content, or Your use of the Service infringes or misappropriates
            the intellectual property rights of a third party or violates applicable
            laws.
          </p>

          <p>
            4.3 You shall indemnify {orgName} for any damages finally
            awarded against, and for reasonable attorney’s fees incurred by,
            {orgName} in connection with any such claim, demand, suit
            or proceeding; provided, that {orgName}
          </p>

          <ul>
            <li>
              (1) promptly gives You written notice of the claim, demand, suit
              or proceeding.
            </li>
            <li>
              (2) gives You sole control of the defense and settlement of the claim,
              demand, suit or proceeding (provided that You may not settle any claim,
              demand, suit or proceeding unless the settlement unconditionally
              releases {orgName} of all liability).
            </li>
            <li>
              (3) provides to You all reasonable assistance, at Your expense.
            </li>
          </ul>

          <h2 className={"text-3xl font-bold"}>5. Privacy</h2>

          <p>
            5.1 We solely collect information used to provide and improve the Service,
            including but not limited to e-mail addresses.
          </p>

          <p>
            5.2 We will not sell for profit any personally identifiable information
            we collect to third-parties.
          </p>

          <p>
            5.3 We may disclose personally identifiable information under special
            circumstances, such as to comply with subpoenas.
          </p>

          <p>
            5.4 A cookie is a small amount of data, which often includes an anonymous
            unique identifier that is stored on your hard-drive by your browser
            and temporary authenticate you to the Service. Cookies are required
            to use the Service.
          </p>

          <p>
            5.5 The Internet is a complex system. You understand that You Content
            is transmitted, stored and manipulated using third-party networks
            and devices {orgName} as no control over.
            We do a reasonable attempt at keeping your private and secure in
            the best of our abilities.
          </p>

          <h2 className={"text-3xl font-bold"}>6. General Conditions</h2>

          <p>
            6.1 You use the Service at your own risk. The service is provided on
            an &quot;as is&quot; and &quot;as available&quot; basis.
          </p>

          <p>
            6.2 You agree not to reproduce, duplicate, modify, sell or resell the Service
            without the express written permission by {orgName}.
          </p>

          <p>
            6.3 Be nice, just do not hack into the Service or falsely imply that you are
            associated with the Service, {orgName}, or any other
            {orgName} service.
          </p>

          <p>
            6.4 Questions about the Terms of Use should be sent to {orgEmail}.
          </p>

        </MaxWidthWrapper>
      </div>
  )
}