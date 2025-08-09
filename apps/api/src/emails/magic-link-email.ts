import {websiteConfig} from "@repo/shared";

export const MAGIC_LINK_EMAIL_SUBJECT = `Your Magic Link for ${websiteConfig.websiteName}.`;
export const MAGIC_LINK_EMAIL_HTML = (
  userName: string,
  magicUrl: string,
): string =>
  `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Magic Link</title>
</head>
<body>
    <p>Hi ${userName || 'there'}</p>
    <p>Click the link below to sign in:</p>
    <p>
      <a href="${magicUrl}" target="_blank">
        Magic Link
      </a>
    </p>
    <p>This link will expire in 15 minutes.</p>
    <p>If you didn't request this, you can safely ignore this email.</p>
    <p>Best regards,<br/>${websiteConfig.websiteDeveloper}</p>
</body>
</html>
  `
