
const Brand = require('../models/Brand');

async function matchLead(lead){
  const brands = await Brand.find({
    cities: lead.city,
    budgetRange: lead.budget
  });
  return brands;
}

module.exports = matchLead;
