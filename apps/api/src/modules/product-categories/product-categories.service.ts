import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {
  PaginateResponse,
  FindAllProductCategoriesRequest,
  ProductCategoryEntity,
  UpdateProductCategoryRequest,
  ProductCategoryTree,
} from '@repo/shared';

@Injectable()
export class ProductCategoriesService {
  private logger = new Logger('ProductCategoriesService');

  constructor(private prismaService: PrismaService,) {
  }

  async findList(
    request: FindAllProductCategoriesRequest,
  ): Promise<PaginateResponse<ProductCategoryEntity>> {
    const {page, pageSize, group, orderBy} = request
    const whereCondition: any = {
      ...(group && {
        group: group
      }),
    };
    const total = await this.prismaService.productCategory.count({
      where: {
        ...whereCondition,
      },
    });
    const items = await this.prismaService.productCategory.findMany({
      where: {
        ...whereCondition,
      },
      orderBy: {
        [orderBy?.field || 'createdAt']: orderBy?.direction || 'desc',
      },
      take: pageSize || 10,
      skip: (page - 1) * (pageSize || 10),
    });

    return {
      items: items,
      meta: {
        page: request.page,
        pageSize: request.pageSize || 10,
        total: total,
        pageCount: Math.ceil(total / (request.pageSize || 10)),
      },
    };
  }

  async findAllSlug(): Promise<string[]> {
    const products = await this.prismaService.productCategory.findMany({
      select: {
        slug: true,
      },
    });
    return products.map(product => product.slug);
  }


  async findTree(): Promise<ProductCategoryTree[]>{
    const categories = await this.prismaService.productCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        group: true,
      },
      orderBy: {
        name: 'asc', // Order by name
      },
    });
    // Group categories by their group field
    const groupMap: Record<string, ProductCategoryTree> = {};
    categories.forEach(category => {
      if (!groupMap[category.group]) {
        groupMap[category.group] = {
          name: category.group,
          text: category.group.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()), // Convert slug to readable text
          children: [],
        };
      }
      groupMap[category.group].children = groupMap[category.group].children || [];
      groupMap[category.group].children!.push({
        name: category.slug,
        text: category.name,
      });
    });
    return Object.values(groupMap);
  }


  async findAll(): Promise<ProductCategoryEntity[]> {
    const products = await this.prismaService.productCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc', // Order by name
      },
    });
    return products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
    }));
  }

  /**
   *
   * @param id or slug
   */
  async findOne(id: string): Promise<ProductCategoryEntity> {
    return this.prismaService.productCategory.findFirst({
      where: {
        OR: [{id: id}, {slug: id}],
      },
    });
  }

  async update(uid: string, id: string, dto: UpdateProductCategoryRequest) {
    return this.prismaService.productCategory.update({
      where: {
        id: id,
      },
      data: {
        updatedAt: new Date(), // Update the timestamp
      },
    });
  }

  async remove(uid: string, id: string) {
    return this.prismaService.productCategory.delete({
      where: {
        id: id,
      },
    });
  }
  //
  // private productHunt = {
  //   "Engineering & Development": [
  //     "A/B testing tools",
  //     "AI coding agents",
  //     "Automation tools",
  //     "Cloud Computing Platforms",
  //     "Code editors",
  //     "Data analysis tools",
  //     "Databases and backend frameworks",
  //     "Headless CMS software",
  //     "Membership software",
  //     "Observability tools",
  //     "Static site generators",
  //     "Testing and QA software",
  //     "VPN client",
  //     "Video hosting platforms",
  //     "Website analytics",
  //     "AI Coding Assistants",
  //     "Authentication & identity tools",
  //     "Content Management Systems",
  //     "Code Review Tools",
  //     "Command line tools",
  //     "Data visualization tools",
  //     "Git clients",
  //     "Issue tracking software",
  //     "No-code platforms",
  //     "Standup bots",
  //     "Terminals",
  //     "Unified API",
  //     "Vibe Coding Tools",
  //     "Web hosting services",
  //     "Website builders"
  //   ],
  //   "Marketing & Sales": [
  //     "Advertising tools",
  //     "Best SEO tools",
  //     "CRM software",
  //     "Email marketing",
  //     "Keyword research tools",
  //     "Lead generation software",
  //     "Sales enablement",
  //     "Social media management tools",
  //     "Survey and form builders",
  //     "Affiliate marketing",
  //     "Business intelligence software",
  //     "Customer loyalty platforms",
  //     "Influencer marketing platforms",
  //     "Landing page builders",
  //     "Marketing automation platforms",
  //     "Sales training",
  //     "Social media scheduling tools"
  //   ],
  //   "Platforms": [
  //     "Crowdfunding",
  //     "Job boards",
  //     "News",
  //     "Real estate",
  //     "Virtual events",
  //     "Event software",
  //     "Language Learning",
  //     "Online learning",
  //     "Startup communities"
  //   ],
  //   "Health & Fitness": [
  //     "Activity tracking",
  //     "Health Insurance",
  //     "Medical",
  //     "Mental Health",
  //     "Sleep apps",
  //     "Workout platforms",
  //     "Camping apps",
  //     "Hiking apps",
  //     "Meditation apps",
  //     "Senior care",
  //     "Therapy apps"
  //   ],
  //   "Social & Community": [
  //     "Blogging platforms",
  //     "Dating apps",
  //     "Live streaming platforms",
  //     "Microblogging platforms",
  //     "Photo sharing",
  //     "Safety and Privacy platforms",
  //     "Social bookmarking",
  //     "Community management",
  //     "Link in bio tools",
  //     "Messaging apps",
  //     "Newsletter platforms",
  //     "Professional networking platforms",
  //     "Social Networking",
  //     "Video and Voice calling"
  //   ],
  //   "Travel": [
  //     "Flight booking apps",
  //     "Maps and GPS",
  //     "Short term rentals",
  //     "Travel Planning",
  //     "Weather apps",
  //     "Hotel booking app",
  //     "Outdoors platforms",
  //     "Travel Insurance",
  //     "Travel apps"
  //   ],
  //   "AI": [
  //     "AI Characters",
  //     "AI Content Detection",
  //     "AI Generative Art",
  //     "AI Headshot Generators",
  //     "AI Infrastructure Tools",
  //     "AI Voice Agents",
  //     "ChatGPT Prompts",
  //     "Predictive AI",
  //     "AI Chatbots",
  //     "AI Databases",
  //     "AI Metrics and Evaluation",
  //     "Avatar generators",
  //     "LLMs",
  //     "Text-to-Speech Software"
  //   ],
  //   "Finance": [
  //     "Accounting software",
  //     "Credit score tools",
  //     "Fundraising resources",
  //     "Invoicing tools",
  //     "Neobanks",
  //     "Payroll software",
  //     "Retirement planning",
  //     "Startup financial planning",
  //     "Stock trading platforms",
  //     "Treasury management platforms",
  //     "Budgeting apps",
  //     "Financial planning",
  //     "Investing",
  //     "Money transfer",
  //     "Online banking",
  //     "Remote workforce tools",
  //     "Savings apps",
  //     "Startup incorporation",
  //     "Tax preparation"
  //   ],
  //   "Design & Creative": [
  //     "3D & Animation",
  //     "Camera apps",
  //     "Design mockups",
  //     "Digital whiteboards",
  //     "Icon sets",
  //     "Mobile editing apps",
  //     "Podcasting",
  //     "Space design apps",
  //     "UI frameworks",
  //     "Video editing",
  //     "Wireframing",
  //     "Background removal tools",
  //     "Design inspiration websites",
  //     "Design resources",
  //     "Graphic design tools",
  //     "Interface design tools",
  //     "Photo editing",
  //     "Social audio apps",
  //     "Stock photo sites",
  //     "User research",
  //     "Wallpapers"
  //   ],
  //   "Product add-ons": [
  //     "Chrome Extensions",
  //     "Figma Templates",
  //     "Slack apps",
  //     "Wordpress Plugins",
  //     "Figma Plugins",
  //     "Notion Templates",
  //     "Twitter apps",
  //     "Wordpress themes"
  //   ],
  //   "Physical Products": [
  //     "Books",
  //     "Furniture",
  //     "Toys",
  //     "Webcams",
  //     "Fitness",
  //     "Games",
  //     "Wearables"
  //   ],
  //   "Web3": [
  //     "Crypto exchanges",
  //     "Crypto wallets",
  //     "Defi",
  //     "NFT marketplaces",
  //     "Crypto tools",
  //     "DAOs",
  //     "NFT creation tools"
  //   ],
  //   "Ecommerce": [
  //     "Ecommerce platforms",
  //     "Payment processors",
  //     "Marketplace sites",
  //     "Shopify Apps"
  //   ],
  //   "Work & Productivity": [
  //     "AI notetakers",
  //     "App switcher",
  //     "Compliance software",
  //     "Dictation Apps",
  //     "Email clients",
  //     "Hiring software",
  //     "Legal services",
  //     "Note and writing apps",
  //     "Password managers",
  //     "Product demo",
  //     "Resume tools",
  //     "Screenshots and screen recording apps",
  //     "Security software",
  //     "Team collaboration software",
  //     "Video conferencing",
  //     "Ad blockers",
  //     "Calendar apps",
  //     "Customer support tools",
  //     "E-signature apps",
  //     "File storage and sharing apps",
  //     "Knowledge base software",
  //     "Meeting software",
  //     "PDF Editor",
  //     "Presentation Software",
  //     "Project management software",
  //     "Scheduling software",
  //     "Search",
  //     "Spreadsheets",
  //     "Time tracking apps",
  //     "Virtual office platforms"
  //   ]
  // }

  // async importProductHuntCategory() {
  //   const groups = Object.keys(this.productHunt);
  //   for (const group of groups) {
  //     // replace & with 'and', remove special characters, and convert to lowercase
  //     const groupSlug = group.toLowerCase()
  //       .replace(/ /g, '-');
  //     const subcategories = this.productHunt[group];
  //
  //     for (const subcategory of subcategories) {
  //       const subSlug = subcategory.toLowerCase()
  //         .replace(/ /g, '-');
  //
  //       const existingSubcategory = await this.prismaService.productCategory.findUnique({
  //         where: {
  //           slug: subSlug,
  //         },
  //       });
  //       if (!existingSubcategory) {
  //         await this.prismaService.productCategory.create({
  //           data: {
  //             name: subcategory,
  //             slug: subSlug,
  //             group: groupSlug,
  //           },
  //         });
  //         this.logger.log(`Created subcategory: ${subcategory}`);
  //       } else {
  //         this.logger.log(`Subcategory already exists: ${subcategory}`);
  //       }
  //     }
  //   }
  // }
}
