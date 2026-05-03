import { useQuery } from "@tanstack/react-query";
import { LegalLayout } from "@/components/layout/legal-layout";

export default function TermsOfService() {
  const { data: termsOfService, isLoading } = useQuery<{ content: string }>({
    queryKey: ["/api/legal/terms_of_service"],
  });

  const lastUpdated = new Date().toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  if (isLoading) {
    return (
      <LegalLayout title="TERMS OF SERVICE" subtitle="LOADING...">
        <p>Synchronizing data layers...</p>
      </LegalLayout>
    );
  }

  const content = termsOfService?.content || `
<div class="space-y-8">
  <section>
    <h2 class="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
    <p class="text-muted-foreground leading-relaxed mb-4">
      By accessing and using this website and services (collectively, the "Services"), you accept and agree to be bound by the terms and provision of this Agreement. This Agreement constitutes the entire and only agreement between you and us and supersedes all prior agreements, representations, and understandings. If you do not agree to abide by the above, please do not use this Service.
    </p>
    <p class="text-muted-foreground leading-relaxed">
      We reserve the right to update and change the Terms of Service at our sole discretion at any time without prior notice. Your continued use of the Services following any such changes constitutes your acceptance of the new Terms of Service.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">2. Use License</h2>
    <p class="text-muted-foreground leading-relaxed mb-4">
      Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
    </p>
    <ul class="list-disc list-inside space-y-2 text-muted-foreground ml-4">
      <li>Modify or copy the materials</li>
      <li>Use the materials for any commercial purpose or for any public display</li>
      <li>Attempt to decompile, disassemble, or reverse engineer any software contained on the website</li>
      <li>Remove any copyright or other proprietary notations from the materials</li>
      <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
      <li>Perform any unauthorized framing or linking to the Services</li>
      <li>Use any automated tools or scripts to harvest data from the Services</li>
      <li>Violate any applicable laws or regulations</li>
    </ul>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">3. Disclaimer of Warranties</h2>
    <p class="text-muted-foreground leading-relaxed mb-4">
      The materials on our website are provided on an "as is" basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation:
    </p>
    <ul class="list-disc list-inside space-y-2 text-muted-foreground ml-4">
      <li>Implied warranties of merchantability</li>
      <li>Implied warranties of fitness for a particular purpose</li>
      <li>Warranties of non-infringement of intellectual property or other rights</li>
      <li>Warranties regarding the accuracy, completeness, or currency of information</li>
    </ul>
    <p class="text-muted-foreground leading-relaxed mt-4">
      We do not warrant that the Services will be uninterrupted or error-free, or that defects will be corrected. Your use of the Services is at your own risk.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">4. Limitation of Liability</h2>
    <p class="text-muted-foreground leading-relaxed mb-4">
      In no event shall our company, its suppliers, or any third parties be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we have been notified of the possibility of such damages.
    </p>
    <p class="text-muted-foreground leading-relaxed">
      Some jurisdictions do not allow the limitation or exclusion of liability for incidental or consequential damages. Accordingly, some of the above limitations may not apply to you. If you are dissatisfied with any portion of the Services or with these Terms of Service, your sole remedy is to cease using the Services.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">5. Accuracy of Materials</h2>
    <p class="text-muted-foreground leading-relaxed">
      The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current. We may make changes to the materials contained on our website at any time without notice. We do not, however, make any commitment to update the materials.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">6. Third-Party Links and Content</h2>
    <p class="text-muted-foreground leading-relaxed mb-4">
      We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.
    </p>
    <p class="text-muted-foreground leading-relaxed">
      Any third-party content, products, or services accessed through our Services are the responsibility of the third party, and we make no warranties or guarantees regarding such third-party offerings. We shall not be liable for any harm or damages arising from your use of third-party content or services.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">7. User Conduct</h2>
    <p class="text-muted-foreground leading-relaxed mb-4">
      You agree not to use the Services in any manner that:
    </p>
    <ul class="list-disc list-inside space-y-2 text-muted-foreground ml-4">
      <li>Is illegal, fraudulent, or deceptive</li>
      <li>Violates any applicable law or regulation</li>
      <li>Infringes on any intellectual property rights</li>
      <li>Harasses, intimidates, or threatens any person</li>
      <li>Uploads or transmits malware or harmful code</li>
      <li>Attempts to gain unauthorized access to our Services</li>
      <li>Interferes with the normal operation of the Services</li>
      <li>Spams or sends unsolicited communications</li>
    </ul>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">8. Intellectual Property Rights</h2>
    <p class="text-muted-foreground leading-relaxed mb-4">
      All content on our website, including text, graphics, logos, images, and software, is the property of our company or its content suppliers and is protected by international copyright laws. You may not reproduce, modify, distribute, or transmit any content without our prior written consent.
    </p>
    <p class="text-muted-foreground leading-relaxed">
      "CodebySRS," our logos, and other marks are trademarks of our company. You may not use any of our marks without our prior written permission.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">9. Modifications to Service</h2>
    <p class="text-muted-foreground leading-relaxed">
      We reserve the right to modify or discontinue the Services (or any part thereof) at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Services.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">10. Termination</h2>
    <p class="text-muted-foreground leading-relaxed mb-4">
      We may terminate your access to the Services at any time, without notice, if you violate these Terms of Service or any applicable laws or regulations.
    </p>
    <p class="text-muted-foreground leading-relaxed">
      Upon termination, your right to use the Services will immediately cease. All provisions of these Terms of Service which by their nature should survive termination shall survive, including but not limited to limitations of liability, disclaimers, and indemnification clauses.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">11. Indemnification</h2>
    <p class="text-muted-foreground leading-relaxed">
      You agree to indemnify and hold harmless our company, its officers, directors, employees, agents, and suppliers from any and all claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or related to your use of the Services, violation of these Terms of Service, or infringement of any intellectual property or other rights.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">12. Governing Law and Jurisdiction</h2>
    <p class="text-muted-foreground leading-relaxed">
      These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction in which our company operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location. If any provision of these Terms of Service is invalid or unenforceable, the remaining provisions shall remain in full force and effect.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">13. Severability</h2>
    <p class="text-muted-foreground leading-relaxed">
      If any provision of these Terms of Service is found to be invalid, illegal, or unenforceable, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, or if such modification is not possible, the provision shall be severed, and the remaining provisions shall continue in full force and effect.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">14. Entire Agreement</h2>
    <p class="text-muted-foreground leading-relaxed">
      These Terms of Service constitute the entire and only agreement between you and us with respect to the Services and supersede all prior and contemporaneous negotiations, representations, and agreements, whether written or oral.
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-bold mb-4">15. Contact Us</h2>
    <p class="text-muted-foreground leading-relaxed">
      If you have any questions, comments, or concerns regarding these Terms of Service or the Services, please contact us at the information provided on our website. We will respond to your inquiry within a reasonable timeframe.
    </p>
  </section>
</div>
  `.trim();

  return (
    <LegalLayout title="TERMS OF SERVICE" subtitle={`LAST UPDATED: ${lastUpdated}`}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </LegalLayout>
  );
}
