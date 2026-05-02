import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();
  const openBooking = () => navigate("/booking");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onBookClick={openBooking} />
      
      <main className="pt-32 pb-24 px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter">
              Terms & Conditions
            </h1>
            <p className="text-muted-foreground font-light text-lg">
              Last updated: March 14, 2026
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8 font-light text-foreground/80 leading-relaxed">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
                1. Agreement to Terms
              </h2>
              <p>
                These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Fetadify ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
              </p>
              <p>
                You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the Site and you must discontinue use immediately.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
                2. Intellectual Property Rights
              </h2>
              <p>
                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws of the applicable jurisdiction, international copyright laws, and international conventions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
                3. User Representations
              </h2>
              <p>
                By using the Site, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
                <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise.</li>
                <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                <li>Your use of the Site will not violate any applicable law or regulation.</li>
              </ul>
            </section>

             <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
                4. Service Delivery and Payment
              </h2>
              <p>
                 We provide engineering and digital design services ("Services"). The specific scope, timelines, and deliverables for each project will be outlined in a separate Statement of Work (SOW) or project agreement. 
              </p>
              <p>
                Payments for our services typically follow a structured schedule defined in the project agreement. We accept major credit cards and other payment methods as indicated on our Site or invoices. All payments must be made in the currency specified in the invoice.
              </p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
                5. Limitation of Liability
              </h2>
              <p>
                In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site or our services, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
                6. Contact Us
              </h2>
              <p>
                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
              </p>
              <p className="font-medium text-foreground">
                Email: contact@fetadify.com<br/>
                Lagos, Nigeria
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
