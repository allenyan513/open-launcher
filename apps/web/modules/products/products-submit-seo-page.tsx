import {useTranslate} from "@/i18n/dictionaries";
import FeaturedProductsView from "@/components/products/FeaturedProductsView";
import Link from "next/link";
import {buttonVariants} from "@repo/ui/button";
import {ProductSubmitSEOPageForm} from "@/modules/products/products-submit-seo-page-form";

/**
 * Product Submit SEO Page
 * 1. Title: Submit Your Product
 * 2. Subtitle: 免费提交你的AI工具或网站，让更多人发现它！我们将自动帮你翻译你的产品信息多个语言进行国际化，让全球用户都能轻松找到并使用你的产品。
 * 3. Form:ProductName, ProductURL
 * 4. Button: Submit  （实际跳转到 /[lang]/dashboard)
 * 5. Fequently Asked Questions
 *   1. 为什么要提交我的产品？ 提交你的产品可以让更多人发现它，增加曝光率和用户量。
 *   2. 提交产品需要收费吗？ 不需要，提交产品是免费的。只需要注册账号，embed我们的badge到你的网站即可。
 *   3. 提交后多久会审核通过？ 一般情况下，通过badge verify后，立即审核通过。如果有问题，我们会通过邮件联系你。
 *   4. 我可以提交哪些类型的产品？ 目前我们接受所有与AI相关的工具和网站, 但是也欢迎其他类型的产品。
 *   5. 我的产品信息会被翻译成哪些语言？ 我们会自动帮你翻译成多种语言，比如英语，西班牙语，法语，德语，中文，日语等。
 *   6. 我可以更新我的产品信息吗？ 可以，你可以随时登录你的账号，更新你的产品信息。
 *
 * @param props
 * @constructor
 */

const faqsData = [
  {
    question: 'Why should I submit my product?',
    answer: 'Submitting your product increases its visibility and helps attract more users.'
  },
  {
    question: 'Is there a fee to submit my product?',
    answer: 'No, it’s completely free. All you need to do is register an account and embed our badge on your website.'
  },
  {
    question: 'How long does the review process take?',
    answer: 'Typically, once the badge is verified, your product will be approved immediately. If there’s an issue, we’ll contact you via email.'
  },
  {
    question: 'What types of products can I submit?',
    answer: 'We currently accept all AI-related tools and websites, but other types of products are also welcome.'
  },
  {
    question: 'Which languages will my product be translated into?',
    answer: 'We will automatically translate it into multiple languages, such as English, Spanish, French, German, Chinese, Japanese, etc.'
  },
  {
    question: 'Can I update my product information later?',
    answer: 'Yes, you can log in to your account at any time to update your product information.'
  }
]


export async function ProductSubmitSEOPage(props: {
  lang: string;
}) {
  const {lang} = props;
  const t = await useTranslate(lang);

  return (
    <div className='flex flex-col md:grid md:grid-cols-12 gap-8 pt-24 pb-12 px-4'>
      <div className="flex flex-col gap-6 md:col-span-8">
        <h1 className="text-xl md:text-3xl font-bold">
          {t('Submit Your Product')}
        </h1>
        <h2 className="text-md md:text-xl ">
          {t('Bnefits of Submitting Your AI Tool or Website')}
        </h2>
        <ul className="list-disc pl-6 text-md md:text-lg space-y-2">
          <li>{t('Free submission of your AI tool or website')}</li>
          <li>{t('Increase visibility and attract more users')}</li>
          <li>{t('Automatic translation into multiple languages')}</li>
          <li>{t('Reach global users with ease')}</li>
        </ul>
        {/*<p className="text-md md:text-lg text-gray-500">*/}
        {/*  {t('Submit your AI tool or website for free and let more people discover it! We will automatically translate your product information into multiple languages to help global users easily find and use your product.')}*/}
        {/*</p>*/}

        <ProductSubmitSEOPageForm lang={lang}/>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            {t('Frequently Asked Questions')}
          </h2>

          <div className="grid grid-cols-1">
            {faqsData?.map((item, index) => (
              <details
                key={index}
                className="py-4 group"
                open={true}
              >
                <summary className="cursor-pointer text-lg font-semibold">
                  {item.question}
                </summary>
                <p className="mt-2 text-gray-500 whitespace-normal">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

      </div>

      <div className='md:col-span-4'>
        <FeaturedProductsView lang={lang}/>
      </div>
    </div>
  );
}
