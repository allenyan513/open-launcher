import {websiteConfig} from "@repo/shared";

export const WELCOME_EMAIL_SUBJECT = `Welcome to ${websiteConfig.websiteName}`;
export const WELCOME_EMAIL_HTML = (
  userName: string,
  submitUrl: string,
): string =>
  `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${websiteConfig.websiteName}</title>
</head>
<body>
    <p>Hi ${userName || 'there'},</p>
    <p>Welcome to <strong>${websiteConfig.websiteName}</strong> — we’re glad to have you here!</p>
    <p>Here’s how you can get started:</p>
    <ol>
    <li>
      <strong>Submit your product:</strong> 
      <a href="${submitUrl}" target="_blank">Submit Product</a>
    </li>
    <li>
      <strong>Support us on GitHub:</strong> 
      <a href="${websiteConfig.websiteGithubLink}" target="_blank">Star our project</a>
    </li>
    <li>
      <strong>Questions?</strong> Just reply to this email — I’m happy to help.
    </li>
    </ol>
    <p>If you didn't request this, you can safely ignore this email.</p>
    <p>Best regards,<br/>${websiteConfig.websiteDeveloper}</p>
</body>
</html>
  `
