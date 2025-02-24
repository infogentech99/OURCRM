const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  apolloId: { type: String, required: true },
  fullName: { type: String, required: true },
  linkedinUrl: { type: String, default: "N/A" },
  firstName: { type: String, default: "N/A" },
  lastName: { type: String, default: "N/A" },
  email: { type: String, required: false, unique: false },  // ⬅️ Removed `unique: true`
  emailStatus: { type: String, default: "N/A" },
  jobTitle: { type: String, default: "N/A" },
  companyName: { type: String, default: "N/A" },
  companyWebsite: { type: String, default: "N/A" },
  city: { type: String, default: "N/A" },
  state: { type: String, default: "N/A" },
  country: { type: String, default: "N/A" },
  industry: { type: String, default: "N/A" },
  keywords: { type: String, default: "N/A" },
  employees: { type: Number, default: 0 },
  companyCity: { type: String, default: "N/A" },
  companyState: { type: String, default: "N/A" },
  companyCountry: { type: String, default: "N/A" },
  companyLinkedinUrl: { type: String, default: "N/A" },
  companyTwitterUrl: { type: String, default: "N/A" },
  companyFacebookUrl: { type: String, default: "N/A" },
  companyPhoneNumbers: { type: String, default: "N/A" },
  twitterUrl: { type: String, default: "N/A" },
  facebookUrl: { type: String, default: "N/A" }
}, { strict: false });

module.exports = mongoose.model('Lead', LeadSchema);
