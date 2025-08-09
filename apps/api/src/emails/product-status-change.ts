import {websiteConfig} from "@repo/shared";

export const PRODUCT_STATUS_CHANGE_EMAIL_SUBJECT = (
  productName: string,
  productStatus: string
): string =>
  `${productName} - Launch ${productStatus} `;
export const PRODUCT_STATUS_CHANGE_EMAIL_HTML = (
  productName: string,
  productStatus: string,
  productLink: string,
  launchDate: string,
  launchURL: string,
  userName: string,
): string =>
  `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${productName} - Launch ${productStatus}</title>
</head>
<body>
    <p>Hi ${userName || 'there'}</p>
    <p>Your product <a href="${productLink}" target="_blank">${productName}</a> has been updated to <strong>${productStatus}</strong>.</p>
    <p>Launch details:</p>
    <ol>
    <li>
      <strong>Product Name:</strong> ${productName}
    </li>
    <li>
      <strong>Product Status:</strong> ${productStatus}
    </li>
    <li>
      <strong>Launch Date:</strong> ${launchDate}
    </li>
    <li>
      <strong>Launch URL:</strong> 
      <a href="${launchURL}" target="_blank">
        ${launchURL}
      </a>
    </ol>
    <p>If you have any questions or need assistance, feel free to reach out.</p>
    <p>Best regards,<br/>${websiteConfig.websiteDeveloper}</p>
</body>
</html>
  `
