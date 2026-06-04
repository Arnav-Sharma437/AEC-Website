export interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  year: string;
  fileUrl: string;
  fileType: "pdf" | "image";
  variant: "iso" | "ce";
}

export const certifications: Certification[] = [
  {
    id: "1",
    name: "ISO 9001:2015",
    issuingBody: "Bureau Veritas",
    year: "2023",
    fileUrl: "/certificates/iso-9001.pdf",
    fileType: "pdf",
    variant: "iso",
  },
  {
    id: "2",
    name: "CE Mark Conformity",
    issuingBody: "European Conformity Assessment",
    year: "2023",
    fileUrl: "/certificates/safety-compliance.pdf",
    fileType: "pdf",
    variant: "ce",
  },
];
