import manicure from "@/assets/spa-manicure.jpg";
import pedicure from "@/assets/spa-pedicure.jpg";
import braids from "@/assets/spa-braids.jpg";
import facial from "@/assets/spa-facial.jpg";
import massage from "@/assets/spa-massage.jpg";
import lashes from "@/assets/spa-lashes.jpg";
import nailart from "@/assets/spa-nailart.jpg";

export const SPA = {
  name: "Dalia Beauty Hub",
  phone: "0123456789",
  whatsapp: "0123456789",
  address: "Kimathi Street, CBD, Nairobi, Kenya",
  email: "hello@daliabeautyhub.co.ke",
};

export const whatsappLink = (msg = "Hi Dalia Beauty Hub! I'd like to book an appointment.") =>
  `https://wa.me/${SPA.whatsapp.replace(/^0/, "254")}?text=${encodeURIComponent(msg)}`;

export type Service = {
  slug: string;
  name: string;
  category: string;
  duration: string;
  price: string;
  description: string;
  image: string;
};

export const services: Service[] = [
  { slug: "manicure", name: "Classic Manicure", category: "Nails", duration: "45 min", price: "KSh 1,500", description: "Shape, cuticle care, polish and a soothing hand massage.", image: manicure },
  { slug: "pedicure", name: "Spa Pedicure", category: "Nails", duration: "60 min", price: "KSh 2,200", description: "Warm soak, exfoliation, callus care and your favourite polish.", image: pedicure },
  { slug: "nail-art", name: "Custom Nail Art", category: "Nails", duration: "75 min", price: "KSh 3,000", description: "Hand-painted designs, gold foil and gem accents to match your vibe.", image: nailart },
  { slug: "braids", name: "Hair Braiding", category: "Hair", duration: "3–6 hrs", price: "from KSh 3,500", description: "Box braids, knotless, cornrows and twists by expert stylists.", image: braids },
  { slug: "facial", name: "Glow Facial", category: "Skin", duration: "60 min", price: "KSh 3,800", description: "Deep cleanse, exfoliation, mask and hydration for a radiant finish.", image: facial },
  { slug: "massage", name: "Hot Stone Massage", category: "Wellness", duration: "75 min", price: "KSh 4,500", description: "Warm basalt stones release tension and restore calm.", image: massage },
  { slug: "lashes", name: "Eyelash Extensions", category: "Lashes & Brows", duration: "90 min", price: "KSh 4,000", description: "Classic, hybrid or volume lashes — feather-light and long lasting.", image: lashes },
  { slug: "body-scrub", name: "Body Scrub & Wrap", category: "Wellness", duration: "60 min", price: "KSh 3,500", description: "Sugar exfoliation followed by a hydrating shea wrap.", image: massage },
];
