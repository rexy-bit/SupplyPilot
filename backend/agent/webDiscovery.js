import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { TAVILY_API_KEY } from "../config/env.js";
import Supplier from "../models/supplier.model.js";

// ─── Heuristiques ─────────────────────────────────────────────────────────────

const CERT_PATTERNS = [
    "ISO9001", "ISO 9001", "ISO-9001",
    "CE", "IEC", "UL", "ATEX", "NEMA",
    "RoHS", "REACH", "FDA", "IATF"
];

const COUNTRY_PATTERNS = [
    { regex: /\b(Germany|Deutschland|Made in Germany)\b/i,    country: "Germany"        },
    { regex: /\b(France|Made in France)\b/i,                   country: "France"         },
    { regex: /\b(Italy|Italia|Made in Italy)\b/i,              country: "Italy"          },
    { regex: /\b(Japan|Made in Japan)\b/i,                     country: "Japan"          },
    { regex: /\b(USA|United States|Made in USA|America)\b/i,   country: "USA"            },
    { regex: /\b(China|Made in China|PRC)\b/i,                 country: "China"          },
    { regex: /\b(South Korea|Korea)\b/i,                       country: "South Korea"    },
    { regex: /\b(Switzerland|Swiss)\b/i,                       country: "Switzerland"    },
    { regex: /\b(Sweden|Sverige)\b/i,                          country: "Sweden"         },
    { regex: /\b(Denmark|Danmark)\b/i,                         country: "Denmark"        },
    { regex: /\b(Netherlands|Holland)\b/i,                     country: "Netherlands"    },
    { regex: /\b(Austria|Österreich)\b/i,                      country: "Austria"        },
    { regex: /\b(Spain|España)\b/i,                            country: "Spain"          },
    { regex: /\b(United Kingdom|UK|England|Britain)\b/i,       country: "United Kingdom" },
    { regex: /\b(India)\b/i,                                    country: "India"          },
    { regex: /\b(Brazil|Brasil)\b/i,                           country: "Brazil"         },
    { regex: /\b(Turkey|Türkiye)\b/i,                          country: "Turkey"         },
    { regex: /\b(Poland|Polska)\b/i,                           country: "Poland"         },
    { regex: /\b(Czech Republic|Czechia)\b/i,                  country: "Czech Republic" },
];

const COMPONENT_KEYWORDS = {
    electric_motor:     ["electric motor", "induction motor", "servo motor", "ac motor", "dc motor", "elektromotor"],
    hydraulic_pump:     ["hydraulic pump", "gear pump", "piston pump", "vane pump", "pompe hydraulique"],
    pressure_valve:     ["pressure valve", "relief valve", "safety valve", "control valve", "pressure regulator"],
    temperature_sensor: ["temperature sensor", "thermocouple", "thermistor", "RTD", "PT100", "temp sensor"],
    roller_bearing:     ["roller bearing", "ball bearing", "tapered bearing", "needle bearing"],
    power_transformer:  ["power transformer", "distribution transformer", "voltage transformer"],
    air_compressor:     ["air compressor", "screw compressor", "piston compressor", "rotary compressor"],
    helical_gearbox:    ["helical gearbox", "gear reducer", "speed reducer", "planetary gearbox"],
};

const DELIVERY_PATTERNS = [
    /delivery[:\s]+(\d+)[-–]?(\d+)?\s*(?:business\s)?days?/i,
    /lead\s*time[:\s]+(\d+)[-–]?(\d+)?\s*(?:business\s)?days?/i,
    /ships?\s+in\s+(\d+)[-–]?(\d+)?\s*days?/i,
    /dispatch[:\s]+(\d+)[-–]?(\d+)?\s*days?/i,
    /(\d+)\s*days?\s+delivery/i,
];

const WARRANTY_PATTERNS = [
    /(\d+)[- ]year\s+warranty/i,
    /warranty[:\s]+(\d+)\s+year/i,
    /(\d+)[- ]year\s+guarantee/i,
    /guarantee[:\s]+(\d+)\s+year/i,
    /(\d+)\s*years?\s+warranty/i,
];

// ─── 1. Recherche Tavily ──────────────────────────────────────────────────────

async function searchWeb(query) {
    const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            api_key:             TAVILY_API_KEY,
            query,
            search_depth:        "advanced",
            max_results:         6,
            include_answer:      false,
            include_raw_content: false,
        })
    });

    if (!res.ok) throw new Error(`Tavily error: ${res.status}`);
    const data = await res.json();

    return (data.results || []).filter(r =>
        r.url?.startsWith("https")       &&
        !r.url.includes("wikipedia")     &&
        !r.url.includes("amazon")        &&
        !r.url.includes("alibaba")       &&
        !r.url.includes("linkedin")      &&
        !r.url.includes("youtube")       &&
        !r.url.includes("facebook")      &&
        !r.url.includes("twitter")       &&
        !r.url.includes("instagram")
    );
}

// ─── 2. Fetch + parse HTML avec Cheerio ──────────────────────────────────────

async function fetchAndParse(url) {
    try {
        const controller = new AbortController();
        const timeout    = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(url, {
            signal:  controller.signal,
            headers: {
                "User-Agent":      "Mozilla/5.0 (compatible; SupplyPilotBot/1.0)",
                "Accept-Language": "en-US,en;q=0.9",
            }
        });
        clearTimeout(timeout);

        if (!res.ok) return null;

        const html = await res.text();
        const $    = cheerio.load(html);

        $("script, style, nav, footer, header, .cookie-banner, .popup, iframe, .menu").remove();

        return {
            title:     $("title").text().trim()                        || "",
            metaDesc:  $('meta[name="description"]').attr("content")   || "",
            h1:        $("h1").first().text().trim()                   || "",
            h2s:       $("h2").map((_, el) => $(el).text().trim()).get().slice(0, 10),
            bodyText:  $("body").text().replace(/\s+/g, " ").trim().substring(0, 6000),
            aboutText: $("#about, .about, [class*='about'], [id*='company'], [class*='company']")
                           .text().replace(/\s+/g, " ").trim().substring(0, 1500),
            footerText:$("footer").text().replace(/\s+/g, " ").trim().substring(0, 500),
        };
    } catch {
        return null;
    }
}

// ─── 3. Extraction du nom du fournisseur ─────────────────────────────────────

function extractSupplierName(parsed, url) {
    // Priorité 1 : balise title nettoyée
    if (parsed.title) {
        const cleaned = parsed.title
            .replace(/[-|–—].*$/, "")           // retire "- slogan" ou "| page"
            .replace(/\s+(Inc|Ltd|GmbH|AG|SAS|SRL|Corp|Co|BV|NV)\.?\s*$/i, "")
            .trim();
        if (cleaned.length > 2 && cleaned.length < 60) return cleaned;
    }

    // Priorité 2 : H1
    if (parsed.h1 && parsed.h1.length > 2 && parsed.h1.length < 60) {
        return parsed.h1.replace(/[-|–].*$/, "").trim();
    }

    // Priorité 3 : domaine URL
    try {
        const hostname = new URL(url).hostname
            .replace(/^www\./, "")
            .replace(/\.(com|net|org|de|fr|it|es|co\.uk|eu)$/, "")
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase());
        return hostname;
    } catch {
        return null;
    }
}

// ─── 4. Extraction du pays ────────────────────────────────────────────────────

function extractCountry(parsed) {
    const textToSearch = [
        parsed.aboutText,
        parsed.footerText,
        parsed.metaDesc,
        parsed.bodyText.substring(0, 2000)
    ].join(" ");

    for (const { regex, country } of COUNTRY_PATTERNS) {
        if (regex.test(textToSearch)) return country;
    }
    return null;
}

// ─── 5. Extraction des certifications ────────────────────────────────────────

function extractCertifications(parsed) {
    const textToSearch = [
        parsed.bodyText,
        parsed.metaDesc,
        parsed.aboutText
    ].join(" ");

    const found = new Set();

    for (const cert of CERT_PATTERNS) {
        // Regex avec word boundary pour éviter les faux positifs
        const regex = new RegExp(`\\b${cert.replace(/\s+/g, "[\\s-]?")}\\b`, "i");
        if (regex.test(textToSearch)) {
            // Normalise : "ISO 9001" → "ISO9001"
            found.add(cert.replace(/\s+/g, ""));
        }
    }

    return [...found];
}

// ─── 6. Extraction des composants fabriqués ──────────────────────────────────

function extractComponents(parsed, targetComponentType) {
    const textToSearch = (parsed.bodyText + " " + parsed.metaDesc).toLowerCase();
    const found        = new Set([targetComponentType]);

    for (const [componentType, keywords] of Object.entries(COMPONENT_KEYWORDS)) {
        for (const keyword of keywords) {
            if (textToSearch.includes(keyword.toLowerCase())) {
                found.add(componentType);
                break;
            }
        }
    }

    return [...found];
}

// ─── 7. Extraction livraison + garantie ──────────────────────────────────────

function extractDelivery(bodyText) {
    for (const pattern of DELIVERY_PATTERNS) {
        const match = bodyText.match(pattern);
        if (match) {
            const min = parseInt(match[1]);
            const max = match[2] ? parseInt(match[2]) : min;
            const avg = Math.round((min + max) / 2);
            if (avg > 0 && avg < 365) return avg;
        }
    }
    return null;
}

function extractWarranty(bodyText) {
    for (const pattern of WARRANTY_PATTERNS) {
        const match = bodyText.match(pattern);
        if (match) {
            const years = parseInt(match[1]);
            if (years > 0 && years <= 20) return years;
        }
    }
    return null;
}

// ─── 8. Score de confiance ────────────────────────────────────────────────────

function computeConfidenceScore(extracted) {
    let score = 0;

    if (extracted.name)                      score += 30;
    if (extracted.country)                   score += 25;
    if (extracted.certifications.length > 0) score += 20;
    if (extracted.components.length > 1)     score += 10;
    if (extracted.avg_delivery_days)         score += 8;
    if (extracted.warranty_years)            score += 7;

    return score;
}

// ─── 9. Pipeline d'extraction complet — ZERO Gemini ──────────────────────────

function extractSupplierData(parsed, url, componentType) {
    const name             = extractSupplierName(parsed, url);
    const country          = extractCountry(parsed);
    const certifications   = extractCertifications(parsed);
    const components       = extractComponents(parsed, componentType);
    const avg_delivery_days= extractDelivery(parsed.bodyText);
    const warranty_years   = extractWarranty(parsed.bodyText);

    const extracted = {
        name,
        country,
        certifications,
        components,
        avg_delivery_days,
        warranty_years,
    };

    const confidence_score = computeConfidenceScore(extracted);

    return { ...extracted, confidence_score };
}

// ─── 10. Upsert MongoDB — schéma existant inchangé ───────────────────────────

async function upsertSupplier(data, url) {
    if (!data?.name) return null;

    try {
        return await Supplier.findOneAndUpdate(
            { name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") } },
            {
                $set: {
                    name:              data.name.trim(),
                    country:           data.country           || "Unknown",
                    certifications:    data.certifications    || [],
                    components:        data.components        || [],
                    avg_delivery_days: data.avg_delivery_days || 7,
                    warranty_years:    data.warranty_years    || 1,
                    rating:            3.5,
                    price_range:       { min: 0, max: 0 },
                    is_active:         true,
                }
            },
            { upsert: true, new: true, runValidators: false }
        );
    } catch (err) {
        console.warn(`⚠️  Upsert skipped (${data.name}): ${err.message}`);
        return null;
    }
}

// ─── 11. Fonction principale exportée ────────────────────────────────────────

export async function discoverSuppliersOnWeb({ component_type, region, standards = [] }) {
    console.log(`\n🌐 Web Discovery: ${component_type} | ${region}`);

    const componentLabel = component_type.replace(/_/g, " ");
    const query = `${componentLabel} manufacturer supplier ${region} ${standards.join(" ")} certified industrial`;

    console.log(`   🔍 Query: "${query}"`);

    let searchResults = [];
    try {
        searchResults = await searchWeb(query);
        console.log(`   Found ${searchResults.length} candidate URLs`);
    } catch (err) {
        console.error(`   ⚠️  Tavily failed: ${err.message}`);
        return [];
    }

    const discovered = [];

    // Traitement séquentiel — évite les rate limits et les timeouts parallèles
    for (const result of searchResults.slice(0, 4)) {
        console.log(`   🕷️  Scraping: ${result.url}`);

        const parsed = await fetchAndParse(result.url);
        if (!parsed) {
            console.log(`      ⏭️  Skipped (fetch failed)`);
            continue;
        }

        const extracted = extractSupplierData(parsed, result.url, component_type);

        console.log(`      Name       : ${extracted.name}`);
        console.log(`      Country    : ${extracted.country}`);
        console.log(`      Certs      : ${extracted.certifications.join(", ") || "none"}`);
        console.log(`      Confidence : ${extracted.confidence_score}/100`);

        // Rejette les extractions de mauvaise qualité
        if (extracted.confidence_score < 40 || !extracted.name) {
            console.log(`      ⏭️  Skipped (low confidence)`);
            continue;
        }

        const saved = await upsertSupplier(extracted, result.url);
        if (!saved) continue;

        discovered.push({
            id:                saved._id,
            name:              saved.name,
            country:           saved.country,
            rating:            saved.rating,
            certifications:    saved.certifications,
            avg_delivery_days: saved.avg_delivery_days,
            warranty_years:    saved.warranty_years,
            price_range:       saved.price_range,
        });

        console.log(`      ✅ Saved: ${saved.name}`);
    }

    console.log(`\n   📦 Discovery complete: ${discovered.length} suppliers saved`);
    return discovered;
}