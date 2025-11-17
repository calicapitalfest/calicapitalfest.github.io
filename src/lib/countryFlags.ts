export function countryToEmoji(country: string): string {
  const codes: Record<string, string> = {
    "Antigua and Barbuda": "AG",
    "Argentina": "AR",
    "Bahamas": "BS",
    "Barbados": "BB",
    "Belize": "BZ",
    "Bolivia": "BO",
    "Brazil": "BR",
    "Canada": "CA",
    "Chile": "CL",
    "Colombia": "CO",
    "Costa Rica": "CR",
    "Cuba": "CU",
    "Dominica": "DM",
    "Dominican Republic": "DO",
    "Ecuador": "EC",
    "El Salvador": "SV",
    "Grenada": "GD",
    "Guatemala": "GT",
    "Guyana": "GY",
    "Haiti": "HT",
    "Honduras": "HN",
    "Jamaica": "JM",
    "Mexico": "MX",
    "Nicaragua": "NI",
    "Panama": "PA",
    "Paraguay": "PY",
    "Peru": "PE",
    "Saint Kitts and Nevis": "KN",
    "Saint Lucia": "LC",
    "Saint Vincent and the Grenadines": "VC",
    "Suriname": "SR",
    "Trinidad and Tobago": "TT",
    "United States": "US",
    "Uruguay": "UY",
    "Venezuela": "VE"
  };

  const code = codes[country.trim()]?.toUpperCase();
  if (!code || code.length !== 2) return "";

  return String.fromCodePoint(
    ...[...code].map(c => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}
