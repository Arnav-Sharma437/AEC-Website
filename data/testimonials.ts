export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  company: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Alamdaar Engineering has been our trusted supplier for over a decade. Their product quality and on-time delivery are unmatched in the industry.",
    name: "Rajesh Kumar",
    company: "Construction Firm, Kolkata",
    rating: 5,
  },
  {
    id: "2",
    quote:
      "From hoists to safety equipment, AEC provides end-to-end solutions. Their team understands our project requirements perfectly.",
    name: "Suresh Reddy",
    company: "Infrastructure Project, Hyderabad",
    rating: 5,
  },
  {
    id: "3",
    quote:
      "Certified products, competitive pricing, and excellent after-sales support. We recommend AEC to all our industry partners.",
    name: "Arun Menon",
    company: "Marine & Industrial, Chennai",
    rating: 5,
  },
];
