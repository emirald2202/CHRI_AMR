import axios from 'axios';
import indianMeds from '../data/indianMeds.json';

export const searchMedicineAPI = async (query) => {
  try {
    const q = query.toLowerCase().trim();
    if (q.length < 3) return [];

    // 1. Search local JSON database (Exact Indian DB matching)
    const localMatches = indianMeds.filter(med => 
      med.brandName.toLowerCase().includes(q) || 
      med.genericName.toLowerCase().includes(q)
    ).map(med => ({
      brandName: med.brandName,
      genericName: med.genericName,
      medicineType: med.type,
      doseWeight: med.dose,
      manufacturer: med.manufacturer,
      isAntibiotic: med.isAntibiotic,
      fullMRP: med.mrp,
      stripSize: med.stripSize,
      source: 'local'
    }));

    // 2. Search OpenFDA API
    let openfdaMatches = [];
    try {
      const res = await axios.get(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${q}+openfda.generic_name:${q}&limit=5`
      );
      
      const results = res.data.results || [];
      openfdaMatches = results.map(item => {
        const bBrand = item.openfda?.brand_name ? item.openfda.brand_name[0] : null;
        const gName = item.openfda?.generic_name ? item.openfda.generic_name[0] : null;

        if (!bBrand) return null;

        return {
          brandName: bBrand,
          genericName: gName || 'Unknown Generic',
          source: 'api' // Explicit label indicating only names are resolved
        };
      }).filter(Boolean);
    } catch (fdaErr) {
      console.warn("OpenFDA fetch failed or timed out, skipping FDA results.", fdaErr.message);
    }

    // 3. Combine and Deduplicate (Prioritize local matches)
    const combined = [...localMatches, ...openfdaMatches];
    const unique = [];
    const seen = new Set();
    
    for (const med of combined) {
       const key = med.brandName.toLowerCase();
       if (!seen.has(key)) {
          seen.add(key);
          unique.push(med);
       }
    }

    return unique.slice(0, 8); // top 8 results combined
  } catch (error) {
    console.error('Master Search Error:', error);
    return [];
  }
};
