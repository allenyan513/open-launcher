import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {EMAIL_FROM} from '../email/email.constants';
import {WELCOME_EMAIL_HTML, WELCOME_EMAIL_SUBJECT,} from '@src/emails/welcome-email';
import {EmailService} from '../email/email.service';
import {ProductEntity, websiteConfig} from "@repo/shared";
import {MAGIC_LINK_EMAIL_HTML, MAGIC_LINK_EMAIL_SUBJECT} from "@src/emails/magic-link-email";
import {PRODUCT_STATUS_CHANGE_EMAIL_HTML, PRODUCT_STATUS_CHANGE_EMAIL_SUBJECT} from "@src/emails/product-status-change";
import dayjs from "dayjs";

@Injectable()
export class NotificationsService {
  private logger = new Logger('NotificationsService');

  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
  ) {
  }

  async onSendMagicLink(email: string, userName: string, magicLink: string,) {
    await this.emailService.send({
      from: EMAIL_FROM,
      to: [email],
      subject: MAGIC_LINK_EMAIL_SUBJECT,
      html: MAGIC_LINK_EMAIL_HTML(userName, magicLink)
    });
  }

  /**
   * Send a welcome email to the user when they are created.
   */
  async onUserCreated(email: string, userName: string,): Promise<void> {
    if (!email || !userName) {
      return;
    }
    await this.emailService.send({
      from: EMAIL_FROM,
      to: email,
      subject: WELCOME_EMAIL_SUBJECT,
      html: WELCOME_EMAIL_HTML(userName, `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/dashboard/submit`),
    });
  }

  /**
   * Notify when a product status changes
   */
  async onProductStatusChanged(productId: string) {
    if (!productId) {
      this.logger.warn('Product is undefined or null in onProductLaunched');
      return;
    }
    const product = await this.prismaService.product.findUnique({
      where: {id: productId},
      include: {
        user: true,
      },
    })
    if (!product) {
      this.logger.warn(`Product with ID ${productId} not found`);
      return;
    }
    await this.emailService.send({
      from: EMAIL_FROM,
      to: product.user.email,
      subject: PRODUCT_STATUS_CHANGE_EMAIL_SUBJECT(product.name, product.status),
      html: PRODUCT_STATUS_CHANGE_EMAIL_HTML(
        product.name,
        product.status,
        product.url,
        dayjs(product.launchDate).format('MMMM D, YYYY'),
        `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/products/${product.slug}`,
        product.user.name,
      ),
    });

  }


  // async onDailyAnalytics(result: {
  //   totalUsers: number;
  //   totalAccount: number;
  //   totalForms: number;
  //   totalWidgets: number;
  //   totalProducts: number;
  //   totalReview: number;
  //   totalReviewMedia: number;
  //   totalCampaign: number;
  // }) {
  //   const html = await render(
  //     React.createElement(DailyAnalyticsEmail, {
  //       userName: 'Admin',
  //       totalUsers: result.totalUsers,
  //       totalAccount: result.totalAccount,
  //       totalForms: result.totalForms,
  //       totalWidgets: result.totalWidgets,
  //       totalProducts: result.totalProducts,
  //       totalReview: result.totalReview,
  //       totalReviewMedia: result.totalReviewMedia,
  //       totalCampaign: result.totalCampaign,
  //     }),
  //   );
  //   await this.emailService.send({
  //     from: EMAIL_FROM,
  //     to: EMAIL_ADMIN,
  //     subject: `Daily Analytics Summary`,
  //     html: html,
  //   });
  // }

}
