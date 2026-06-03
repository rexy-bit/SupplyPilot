import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";
import Supplier from "../models/supplier.model.js";
import Quote from "../models/quote.model.js";

const suppliers = [
   {
    name: "Schneider Electric",
    country: "France",
    rating: 4.8,
    certifications: ["CE", "IEC", "ISO9001"],
    components: ["electric_motor", "sensor", "drive", "plc"],
    avg_delivery_days: 6,
    warranty_years: 3,
    price_range: { min: 1200, max: 1600 }
},
{
    name: "Rockwell Automation",
    country: "USA",
    rating: 4.7,
    certifications: ["UL", "NEMA", "ISO9001"],
    components: ["plc", "drive", "sensor"],
    avg_delivery_days: 12,
    warranty_years: 3,
    price_range: { min: 1400, max: 1800 }
},
{
    name: "Mitsubishi Electric",
    country: "Japan",
    rating: 4.9,
    certifications: ["CE", "IEC", "ISO9001"],
    components: ["electric_motor", "drive", "sensor"],
    avg_delivery_days: 9,
    warranty_years: 3,
    price_range: { min: 1250, max: 1650 }
},
{
    name: "Yaskawa Electric",
    country: "Japan",
    rating: 4.8,
    certifications: ["CE", "IEC"],
    components: ["electric_motor", "drive"],
    avg_delivery_days: 8,
    warranty_years: 2,
    price_range: { min: 1150, max: 1500 }
},
{
    name: "Bosch Rexroth",
    country: "Germany",
    rating: 4.7,
    certifications: ["CE", "ISO9001"],
    components: ["hydraulic_pump", "gearbox", "drive"],
    avg_delivery_days: 10,
    warranty_years: 2,
    price_range: { min: 1300, max: 1750 }
},
{
    name: "Hitachi Industrial Components",
    country: "Japan",
    rating: 4.6,
    certifications: ["CE", "IEC", "ISO9001"],
    components: ["electric_motor", "transformer"],
    avg_delivery_days: 11,
    warranty_years: 3,
    price_range: { min: 1100, max: 1500 }
},
{
    name: "Emerson Electric",
    country: "USA",
    rating: 4.7,
    certifications: ["UL", "ISO9001"],
    components: ["sensor", "valve", "compressor"],
    avg_delivery_days: 13,
    warranty_years: 3,
    price_range: { min: 1000, max: 1400 }
},{
    name: "General Electric (GE Grid Solutions)",
    country: "USA",
    rating: 4.7,
    certifications: ["UL", "ISO9001", "CE"],
    components: ["transformer", "power_transformer", "sensor"],
    avg_delivery_days: 14,
    warranty_years: 3,
    price_range: { min: 1500, max: 2000 }
},
{
    name: "Eaton Corporation",
    country: "USA",
    rating: 4.6,
    certifications: ["UL", "NEMA", "ISO9001"],
    components: ["electric_motor", "circuit_breaker", "drive"],
    avg_delivery_days: 11,
    warranty_years: 3,
    price_range: { min: 1300, max: 1700 }
},
{
    name: "Danfoss",
    country: "Denmark",
    rating: 4.7,
    certifications: ["CE", "IEC", "ISO9001"],
    components: ["electric_motor", "valve", "compressor", "drive"],
    avg_delivery_days: 8,
    warranty_years: 2,
    price_range: { min: 1200, max: 1550 }
},
{
    name: "Bonfiglioli",
    country: "Italy",
    rating: 4.5,
    certifications: ["CE", "ISO9001"],
    components: ["gearbox", "electric_motor", "drive"],
    avg_delivery_days: 6,
    warranty_years: 2,
    price_range: { min: 1000, max: 1350 }
},
{
    name: "Nidec Corporation",
    country: "Japan",
    rating: 4.8,
    certifications: ["CE", "IEC", "ISO9001"],
    components: ["electric_motor", "compressor", "sensor"],
    avg_delivery_days: 9,
    warranty_years: 3,
    price_range: { min: 1150, max: 1600 }
}
];

export const seedDatabase = async () => {
    await mongoose.connect(DB_URI);
    
    await Supplier.deleteMany({});
    const insertedSuppliers = await Supplier.insertMany(suppliers);
    console.log(`✅ ${insertedSuppliers.length} fournisseurs insérés`);

    // Génère des devis pour chaque fournisseur
    const quotes = insertedSuppliers.map(s => ({
        supplier: s._id,
        supplier_name: s.name,
        component_type: "electric_motor",
        specifications: {
            power: "15kW",
            protection: "IP55",
            standard: "IEC",
            voltage: "400V"
        },
        price: Math.floor(
            Math.random() * (s.price_range.max - s.price_range.min) 
            + s.price_range.min
        ),
        delivery_days: s.avg_delivery_days,
        currency: "EUR"
    }));

    await Quote.deleteMany({});
    await Quote.insertMany(quotes);
    console.log(`✅ ${quotes.length} devis insérés`);

    mongoose.disconnect();
    console.log("🎉 Base de données peuplée avec succès !");
};

seedDatabase().catch(console.error);