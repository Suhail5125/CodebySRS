import { useQuery } from "@tanstack/react-query";
import { LegalLayout } from "@/components/layout/legal-layout";

export default function PrivacyPolicy() {
  const { data: privacyPolicy, isLoading } = useQuery<{ content: string }>({
    queryKey: ["/api/legal/privacy_policy"],
  });

  const lastUpdated = new Date().toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  if (isLoading) {
    return (
      <LegalLayout title="PRIVACY POLICY" subtitle="LOADING...">
        <p>Synchronizing data layers...</p>
      </LegalLayout>
    );
  }

  const content = privacyPolicy?.content || `
<div class="space-y-8">
  <section>
    <h2 class="text-2xl font-bold mb-4">1. Introduction</h2>
    <p class="text-muted-foreground leading-relaxed mb-4">
      We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with our policies and practices, please do not use our services.
    </p>
    <p class="text-muted-foreground leading-relaxed">
      We reserve the right to make changes to this Privacy Policy at any time and for any reason. Any changes or modifications will be effective immediately upon posting to the website, and you will be deemed to have accepted the changes by your continued use of the website.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">2. Information We Collect</h2>
    <p class="text-muted-foreground leading-relaxed mb-4">
      We may collect information about you in a variety of ways. The information we may collect on the website includes:
    </p>
    <div class="space-y-3 ml-4">
      <div>
        <h3 class="font-semibold text-foreground mb-2">Personal Information</h3>
        <ul class="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Name and email address</li>
          <li>Phone number</li>
          <li>Mailing address</li>
          <li>Company information</li>
          <li>Subject matter of inquiry</li>
          <li>Any other information you choose to provide</li>
        </ul>
      </div>
      <div>
        <h3 class="font-semibold text-foreground mb-2">Automatically Collected Information</h3>
        <ul class="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>IP address</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring website</li>
          <li>Device identifiers</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </div>
    </div>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">3. Use of Your Information</h2>
    <p class="text-muted-foreground leading-relaxed mb-4">
      Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. We use information we collect in the following ways:
    </p>
    <ul class="list-disc list-inside space-y-2 text-muted-foreground ml-4">
      <li>To create and maintain your account</li>
      <li>To respond to your inquiries and provide customer support</li>
      <li>To process your transactions and send related information</li>
      <li>To send promotional communications, updates, and marketing materials</li>
      <li>To generate analytics about website usage and user behavior</li>
      <li>To improve and optimize our website and services</li>
      <li>To monitor and analyze trends and usage</li>
      <li>To detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
      <li>To personalize and improve your experience on our website</li>
      <li>To comply with legal and regulatory requirements</li>
    </ul>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">4. Disclosure of Your Information</h2>
    <p class="text-muted-foreground leading-relaxed mb-4">
      We may share information we have collected about you in certain situations:
    </p>
    <div class="space-y-3 ml-4">
      <div>
        <h3 class="font-semibold text-foreground mb-2">By Law or to Protect Rights</h3>
        <p class="text-muted-foreground">
          If required by law or if we believe in good faith that such disclosure is necessary to comply with legal obligations, protect our rights, or protect the safety of our users.
        </p>
      </div>
      <div>
        <h3 class="font-semibold text-foreground mb-2">Third-Party Service Providers</h3>
        <p class="text-muted-foreground">
          We may share your information with third parties that perform services for us, including payment processors, hosting providers, analytics providers, and email service providers. These providers are bound by confidentiality agreements.
        </p>
      </div>
      <div>
        <h3 class="font-semibold text-foreground mb-2">Business Transfers</h3>
        <p class="text-muted-foreground">
          If we are involved in a merger, acquisition, bankruptcy, dissolution, reorganization, or similar transaction or proceeding, your information may be transferred as part of that transaction.
        </p>
      </div>
      <div>
        <h3 class="font-semibold text-foreground mb-2">With Your Consent</h3>
        <p class="text-muted-foreground">
          We may disclose your information with your explicit consent for any purpose not covered by this Privacy Policy.
        </p>
      </div>
    </div>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">5. Security of Your Information</h2>
    <p class="text-muted-foreground leading-relaxed">
      We use administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is completely secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. Your use of our services is at your own risk.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">6. Cookies and Tracking Technologies</h2>
    <p class="text-muted-foreground leading-relaxed mb-4">
      Our website uses cookies and similar tracking technologies to enhance your user experience, remember your preferences, and understand how you interact with our site. You can control cookie settings through your browser, though disabling cookies may affect site functionality.
    </p>
    <p class="text-muted-foreground leading-relaxed">
      We may also use analytics services like Google Analytics to track user behavior and improve our website. These services may collect information about your browsing activities.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">7. Third-Party Links</h2>
    <p class="text-muted-foreground leading-relaxed">
      Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any website before providing your information.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">8. Your Privacy Rights</h2>
    <p class="text-muted-foreground leading-relaxed mb-4">
      Depending on your location, you may have certain rights regarding your personal information:
    </p>
    <ul class="list-disc list-inside space-y-2 text-muted-foreground ml-4">
      <li>Right to access your personal information</li>
      <li>Right to correct inaccurate information</li>
      <li>Right to request deletion of your information</li>
      <li>Right to opt-out of marketing communications</li>
      <li>Right to data portability</li>
      <li>Right to withdraw consent</li>
    </ul>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">9. Children's Privacy</h2>
    <p class="text-muted-foreground leading-relaxed">
      Our website is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information and terminate the child's account.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">10. Data Retention</h2>
    <p class="text-muted-foreground leading-relaxed">
      We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. We will delete or anonymize your information when it is no longer needed, unless we are required to retain it by law.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">11. International Data Transfers</h2>
    <p class="text-muted-foreground leading-relaxed">
      If you access our website from outside your country of residence, your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have data protection laws that differ from your home country.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">12. Contact Us</h2>
    <p class="text-muted-foreground leading-relaxed">
      If you have questions, comments, or requests regarding this Privacy Policy or our privacy practices, please contact us at the information provided on our website. We will respond to your request within a reasonable timeframe.
    </p>
  </section>
</div>
  `.trim();

  return (
    <LegalLayout title="PRIVACY POLICY" subtitle={`LAST UPDATED: ${lastUpdated}`}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </LegalLayout>
  );
}
