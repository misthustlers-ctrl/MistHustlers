import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";

export default function Contact() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="contact" />
      <SchemaMarkup page="notFound" />
      <GlobalNavbar />
      <main>
        <section className="pt-32 pb-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                Get in Touch
              </span>
              <h1 className="font-display text-[clamp(48px,8vw,80px)] leading-[0.9] tracking-[0.02em] text-abyssal-ink">
                Contact Us
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                Based in Indore, serving clients worldwide. Get a quote within 48 hours.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="bg-ash-white rounded-[40px] p-8 border border-abyssal-ink/5 space-y-6">
                <h2 className="font-body font-bold text-2xl tracking-[0.02em] text-abyssal-ink">Contact Information</h2>

                <div>
                  <p className="text-sm font-semibold text-abyssal-ink/50 uppercase tracking-wider mb-1">Address</p>
                  <p className="text-abyssal-ink font-body">Indore, Madhya Pradesh 452001, India</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-abyssal-ink/50 uppercase tracking-wider mb-1">Email</p>
                  <a href="mailto:misthustlers@gmail.com" className="text-digital-orange hover:underline font-body">misthustlers@gmail.com</a>
                </div>

                <div>
                  <p className="text-sm font-semibold text-abyssal-ink/50 uppercase tracking-wider mb-1">Phone / WhatsApp</p>
                  <a href="tel:+918889937648" className="text-digital-orange hover:underline font-body">+91 888 993 7648</a>
                </div>

                <div>
                  <p className="text-sm font-semibold text-abyssal-ink/50 uppercase tracking-wider mb-1">Business Hours</p>
                  <p className="text-abyssal-ink font-body">Mon-Fri: 9:00 AM - 6:00 PM<br />Sat: 10:00 AM - 2:00 PM</p>
                </div>

                <a
                  href="https://wa.me/918889937648?text=Hi%20MistHustlers%2C%20I%20want%20to%20discuss%20a%20project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-[800px] text-sm font-semibold hover:bg-green-600 transition-colors font-body"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Chat on WhatsApp
                </a>
              </div>

              <div className="rounded-[40px] overflow-hidden border border-abyssal-ink/5 h-full min-h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.21689636887!2d75.788529!3d22.719568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b410ddb%3A0x96ec4da356240f4!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "300px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MistHustlers Location - Indore"
                />
              </div>
            </div>

            <div id="inquiry-form">
              <ServiceInquiryForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
