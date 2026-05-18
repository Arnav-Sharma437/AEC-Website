export interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  year: string;
  fileUrl: string;
  fileType: "pdf" | "image";
}

export const certifications: Certification[] = [
  {
    id: "1",
    name: "ISO 9001:2015",
    issuingBody: "Bureau Veritas",
    year: "2023",
    fileUrl: "/certificates/iso-9001.pdf",
    fileType: "pdf",
  },
  {
    id: "2",
    name: "Quality Management Certificate",
    issuingBody: "International Standards Body",
    year: "2023",
    fileUrl: "/certificates/quality-mgmt.pdf",
    fileType: "pdf",
  },
  {
    id: "3",
    name: "Safety Compliance Certificate",
    issuingBody: "Industrial Safety Board",
    year: "2022",
    fileUrl: "/certificates/safety-compliance.pdf",
    fileType: "pdf",
  },
];
