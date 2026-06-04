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
  {
    id: "4",
    quote:
      "AEC Has Been Our Go-To Supplier For Wire Ropes And Lifting Hardware. Their Quality Is Consistent And Delivery Is Always On Time.",
    name: "Vikram Shah",
    company: "Port Operations, Mumbai",
    rating: 5,
  },
  {
    id: "5",
    quote:
      "We Have Been Sourcing Hoists And Material Handling Equipment From AEC For Years. Reliable Products And Excellent Service.",
    name: "Mohammed Ismail",
    company: "Logistics Manager, Chennai",
    rating: 5,
  },
  {
    id: "6",
    quote:
      "AEC's Scaffolding And Rigging Solutions Have Been Instrumental In Our Large Infrastructure Projects. Highly Professional Team.",
    name: "Pradeep Nair",
    company: "Project Engineer, Bangalore",
    rating: 5,
  },
];
