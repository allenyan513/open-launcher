import './page.css'

export default function Home() {

  return (
    <div className='flex flex-col items-start w-full xl:w-[1280px] px-4 gap-4'>
      <h1>Privacy Policy</h1>
      <p> Last updated: Dec 21, 2024 </p>
      <h2>
        Introduction
      </h2>
      <p>
        FF2050.AI values the privacy of our users (user or you). This Privacy Policy outlines how we collect, use,
        and safeguard your information when you use our
        website https://ai.ff2050.com (the Site), including our Chrome Extension. By using the Site, you
        consent to the data practices described in this policy.
      </p>
      <h2>
        Information We Collect
      </h2>
      <p>
        We collect information in the following ways:
      </p>

      1. Personal Data
      <ul>
        <li>Your name and email address when you register or interact with our services.</li>
      </ul>

      2. Derivative Data
      <ul>
        <li>Automatically collected information such as your IP address, browser type, operating system, and access
          times.
        </li>
      </ul>
      3. App Usage Data
      <ul>
        <li>
          How you use our application to enhance our services.
        </li>
      </ul>

      4. Diagnostic and Performance Data
      <ul>
        <li>
          We use Firebase Analytics to gather anonymized usage data, such as user interactions, session durations, and
          performance metrics.
        </li>
        <li>
          We use Firebase Crashlytics to collect crash reports and error logs to diagnose and resolve technical issues.
        </li>
      </ul>
      <h2>
        Use of Information
      </h2>
      We use the collected information for the following purposes:

      <ul>
        <li>
          To manage your account and provide our services.
        </li>
        <li>
          To produce anonymized analytics for improving the performance and functionality of our application.
        </li>
        <li>
          To monitor and resolve technical issues using diagnostic data from Firebase Crashlytics.
        </li>
      </ul>

      <h2>
        Cookies and Tracking Technologies
      </h2>
      Cookies are used to facilitate the core functions of our Site and services. Specifically:
      <ul>
        <li>
          We use cookies to remember your preferences and improve your user experience.
        </li>
        <li>
          Firebase Analytics and Crashlytics may use similar technologies to collect anonymized data about your
          interactions with our services.
        </li>
        <li>
          The YouTube embedded player uses the only third-party cookie on our Site.
        </li>
      </ul>
      <h2>
        Data Retention
      </h2>
      We retain your personal information and diagnostic data:
      <ul>
        <li>For as long as it is necessary to fulfill the purposes outlined in this Privacy Policy.</li>
        <li> Unless a longer retention period is required or permitted by law.</li>
      </ul>
      <h2>
        Data Security
      </h2>
      <p>
        We implement a variety of security measures to maintain the safety of your personal information, including the
        data collected via Firebase services. While we strive to protect your information, no security measures can
        guarantee absolute protection.
      </p>
      <h2>
        Your Choices and Rights
      </h2>
      You have the right to:
      <ul>
        <li> Review, change, or delete your personal information by emailing us.
        </li>
        <li> Opt-out of data collection by adjusting your device settings to limit diagnostic and analytics data
          collection where applicable.
        </li>
      </ul>
      <h2>
        Changes to This Privacy Policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time. The updated version will be indicated by an updated
        Effective Date and will be effective as soon as it is accessible. We encourage you to review this Privacy
        Policy periodically to stay informed of our privacy practices.
      </p>
      <h2>
        Contact Us
      </h2>
      <p>
        For any questions or comments about this Privacy Policy, please contact us at:<br/>
        6211 Pepperell Str.<br/>
        Halifax, NS, Canada <br/>
        Email: wsyanligang@gmail.com <br/>
      </p>
    </div>
  );
}
