import { FadeUp } from '../hooks/useInView'
import { OpenMIcon } from '../components/BrandElements'

export default function PrivacyPage() {
  return (
    <div className="with-mobile-cta">
      <section className="relative pt-32 pb-20 bg-white overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/3 opacity-[0.04] pointer-events-none">
          <OpenMIcon size={500} />
        </div>
        <div className="container-wide section-padding relative z-10 max-w-3xl">
          <FadeUp>
            <span className="tag-badge mb-5 inline-flex">Legal</span>
            <h1 className="font-sora font-extrabold text-4xl md:text-5xl text-charcoal">Privacy Policy</h1>
            <p className="mt-3 text-gray-mid text-sm font-sora">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="mt-10 prose prose-sm max-w-none font-sora text-gray-dark leading-relaxed space-y-6">
              {[
                { heading: 'Who we are', body: 'Mein is a youth empowerment movement. Our website address is mein.co. When we refer to "Mein," "we," "us," or "our," we mean the Mein organisation.' },
                { heading: 'What data we collect', body: 'We collect data you voluntarily provide: name, email address, age, creative submissions, and (for under-18s) parent or guardian details. We also collect basic usage analytics to understand how our site is used.' },
                { heading: 'How we use your data', body: 'We use your data to process and review your submission, to contact you about your submission, to send consent requests to parent or guardians of under-18 submitters, and to publish approved content on our platform.' },
                { heading: 'Under-18 protection', body: 'Any submission from a person under 18 years of age requires parent or guardian consent before it can be published publicly. We store guardian contact details securely and only use them for consent purposes.' },
                { heading: 'Data sharing', body: 'We do not sell your data. We do not share your data with third parties except where required by law or where strictly necessary to operate the platform (e.g., cloud hosting providers).' },
                { heading: 'Your rights', body: 'You have the right to request access to, correction of, or deletion of your personal data. To exercise these rights, contact us through the contact page.' },
                { heading: 'Cookies', body: 'We use minimal cookies for site functionality. We do not use advertising or tracking cookies.' },
                { heading: 'Contact', body: 'For any privacy-related questions, use our contact form. We aim to respond within 5 working days.' },
              ].map((section) => (
                <div key={section.heading}>
                  <h2 className="font-sora font-bold text-charcoal text-lg mb-2">{section.heading}</h2>
                  <p>{section.body}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}

export function TermsPage() {
  return (
    <div className="with-mobile-cta">
      <section className="relative pt-32 pb-20 bg-white overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/3 opacity-[0.04] pointer-events-none">
          <OpenMIcon size={500} />
        </div>
        <div className="container-wide section-padding relative z-10 max-w-3xl">
          <FadeUp>
            <span className="tag-badge mb-5 inline-flex">Legal</span>
            <h1 className="font-sora font-extrabold text-4xl md:text-5xl text-charcoal">Terms of Use</h1>
            <p className="mt-3 text-gray-mid text-sm font-sora">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="mt-10 font-sora text-gray-dark leading-relaxed space-y-6">
              {[
                { heading: 'Acceptance of terms', body: 'By using the Mein website and submitting content, you agree to these terms and our Community Rules.' },
                { heading: 'Content ownership', body: 'You retain ownership of any original content you submit. By submitting, you grant Mein a non-exclusive licence to display your content on the platform for the purposes of the movement.' },
                { heading: 'Content standards', body: 'All submissions must comply with our Community Rules. Content that violates these rules will not be published and may result in removal from the platform.' },
                { heading: 'Under-18 submissions', body: 'Submissions from users under 18 require verifiable parent or guardian consent before publication. Users confirm their age accurately when submitting.' },
                { heading: 'No guarantee of publication', body: 'Submission to Mein does not guarantee publication. All submissions are reviewed by the team before being made public.' },
                { heading: 'Platform availability', body: 'We aim to keep the platform available but cannot guarantee uninterrupted access. We may modify or discontinue features at any time.' },
                { heading: 'Changes to terms', body: 'We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.' },
              ].map((section) => (
                <div key={section.heading}>
                  <h2 className="font-sora font-bold text-charcoal text-lg mb-2">{section.heading}</h2>
                  <p>{section.body}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
