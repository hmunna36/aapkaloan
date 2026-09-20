// Leadership profiles.
//
// TODO (content): the POC brief supplied four photos and four names but left the
// name / designation / LinkedIn / experience / message table empty. Photos are
// mapped to names in the order they appear in the brief — please confirm the
// mapping and replace every placeholder below (designation, years, bio,
// expertise tags and LinkedIn URL) before launch.

export type Leader = {
  slug: string;
  name: string;
  designation: string;
  photo: string;
  experienceYears: string;
  bio: string;
  expertise: string[];
  linkedin: string;
  message?: string;
};

const PLACEHOLDER_BIO =
  "Short professional bio to be added — career background, key mandates handled and areas of focus across banking, NBFC and structured funding.";

// The five experience areas the brief asks us to highlight for every leader.
export const expertiseAreas = ["Banking", "NBFC", "VC Funding", "Private Placement", "Financial Services"] as const;

export const team: Leader[] = [
  {
    slug: "raghu",
    name: "Raghu",
    designation: "Leadership Team", // TODO: designation
    photo: "/team/raghu.jpg",
    experienceYears: "XX+", // TODO: years of experience
    bio: PLACEHOLDER_BIO, // TODO: bio
    expertise: ["Banking", "NBFC", "Financial Services"], // TODO: confirm
    linkedin: "", // TODO: LinkedIn URL
  },
  {
    slug: "suresh",
    name: "Suresh",
    designation: "Leadership Team",
    photo: "/team/suresh.jpg",
    experienceYears: "XX+",
    bio: PLACEHOLDER_BIO,
    expertise: ["Banking", "Private Placement", "Financial Services"],
    linkedin: "",
  },
  {
    slug: "nagarajan",
    name: "Nagarajan",
    designation: "Leadership Team",
    photo: "/team/nagarajan.jpg",
    experienceYears: "XX+",
    bio: PLACEHOLDER_BIO,
    expertise: ["NBFC", "VC Funding", "Financial Services"],
    linkedin: "",
  },
  {
    slug: "pradeep",
    name: "Pradeep",
    designation: "Leadership Team",
    photo: "/team/pradeep.jpg",
    experienceYears: "XX+",
    bio: PLACEHOLDER_BIO,
    expertise: ["Banking", "VC Funding", "Private Placement"],
    linkedin: "",
  },
];
