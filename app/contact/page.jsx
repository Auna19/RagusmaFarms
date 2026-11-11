import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { db } from '@/lib/db';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default function ContactPage() {
  const content = db.content.get();

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-forest-950">
      <Navbar />

      <section className="bg-forest-900 text-white py-16 text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-gold-400 font-bold uppercase tracking-widest text-xs">Reach Out To Us</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold mt-2">
            Contact Ragusma Farms
          </h1>
          <p className="text-forest-200 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Have an inquiry about live chicken batches, frozen cuts, catfish, rabbit breeding pairs, manure truckloads, or farm visits? We are here to help.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
                Headquarters & Farm Office
              </span>
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                Let’s Connect
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Feel free to visit our farm gate, call our desk lines, or send us a WhatsApp message. For locations not listed in the standard delivery checkout, contact us here for immediate custom fulfillment.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-forest-50/70 border border-forest-100">
                  <div className="w-10 h-10 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-500">Phone & WhatsApp</h4>
                    <a href={`tel:${content.contact.phone}`} className="text-sm sm:text-base font-bold text-forest-900 hover:underline block">
                      {content.contact.phone}
                    </a>
                    <a 
                      href={`https://wa.me/2348135834368?text=Hello%20Ragusma%20Farms,%20I%20would%20like%20to%20inquire%20about%20your%20products`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs font-semibold text-emerald-700 hover:underline mt-1 inline-flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" /> Chat on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-forest-50/70 border border-forest-100">
                  <div className="w-10 h-10 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-500">Email Address</h4>
                    <a href={`mailto:${content.contact.email}`} className="text-sm sm:text-base font-bold text-forest-900 hover:underline">
                      {content.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-forest-50/70 border border-forest-100">
                  <div className="w-10 h-10 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-500">Farm Location & Gate</h4>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">
                      📍 Tunga goro, Behind FGC minna, Niger state.
                    </p>
                    <p className="text-[11px] text-forest-700 italic mt-0.5">
                      &quot;At the very heart of agriculture is the drive to feed the world.&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-forest-50/70 border border-forest-100">
                  <div className="w-10 h-10 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-500">Farm Operating Hours</h4>
                    <p className="text-xs sm:text-sm font-medium text-gray-800">
                      {content.contact.workingHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7">
              <ContactForm 
                title="Direct Message Form"
                subtitle="We respond promptly to customer questions and bulk requests."
              />
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

