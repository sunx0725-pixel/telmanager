const fs = require('fs');
const path = require('path');

const icons = [
  { name: 'home', active: false },
  { name: 'home-active', active: true },
  { name: 'phone', active: false },
  { name: 'phone-active', active: true },
  { name: 'pay', active: false },
  { name: 'pay-active', active: true },
  { name: 'invoice', active: false },
  { name: 'invoice-active', active: true },
  { name: 'mine', active: false },
  { name: 'mine-active', active: true }
];

// Simple PNG generation using canvas-like drawing in SVG then convert to PNG via base64
const svgTemplates = {
  'home': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81 81" width="81" height="81"><path d="M40.5 8.5L10 33.5h6v34h20V48h8v19.5h20V33.5h6L40.5 8.5z" fill="none" stroke="#999999" stroke-width="5" stroke-linejoin="round"/></svg>`,
  'home-active': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81 81" width="81" height="81"><path d="M40.5 8.5L10 33.5h6v34h20V48h8v19.5h20V33.5h6L40.5 8.5z" fill="#3182CE"/></svg>`,
  'phone': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81 81" width="81" height="81"><rect x="20" y="6" width="41" height="69" rx="7" fill="none" stroke="#999999" stroke-width="5"/><circle cx="40.5" cy="68" r="3.5" fill="#999999"/><rect x="27" y="13" width="27" height="34" rx="3.5" fill="none" stroke="#999999" stroke-width="3.5"/></svg>`,
  'phone-active': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81 81" width="81" height="81"><rect x="20" y="6" width="41" height="69" rx="7" fill="#3182CE"/><circle cx="40.5" cy="68" r="3.5" fill="white"/><rect x="27" y="13" width="27" height="34" rx="3.5" fill="white" opacity="0.3"/></svg>`,
  'pay': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81 81" width="81" height="81"><rect x="10" y="17" width="61" height="47" rx="7" fill="none" stroke="#999999" stroke-width="5"/><rect x="10" y="17" width="61" height="13.5" fill="none" stroke="#999999" stroke-width="3.5"/><circle cx="64" cy="40.5" r="7" fill="none" stroke="#999999" stroke-width="3.5"/></svg>`,
  'pay-active': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81 81" width="81" height="81"><rect x="10" y="17" width="61" height="47" rx="7" fill="#3182CE"/><rect x="10" y="17" width="61" height="13.5" fill="white" opacity="0.3"/><circle cx="64" cy="40.5" r="7" fill="white"/></svg>`,
  'invoice': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81 81" width="81" height="81"><path d="M23.5 10h34l10 10v51h-44V10z" fill="none" stroke="#999999" stroke-width="5" stroke-linejoin="round"/><path d="M57.5 10v10h10" fill="none" stroke="#999999" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="30" y="30" width="21" height="3.5" fill="#999999" rx="1.75"/><rect x="30" y="40" width="21" height="3.5" fill="#999999" rx="1.75"/><rect x="30" y="50" width="14" height="3.5" fill="#999999" rx="1.75"/></svg>`,
  'invoice-active': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81 81" width="81" height="81"><path d="M23.5 10h34l10 10v51h-44V10z" fill="#3182CE"/><path d="M57.5 10v10h10" fill="white" opacity="0.3"/><rect x="30" y="30" width="21" height="3.5" fill="white" rx="1.75"/><rect x="30" y="40" width="21" height="3.5" fill="white" rx="1.75"/><rect x="30" y="50" width="14" height="3.5" fill="white" rx="1.75"/></svg>`,
  'mine': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81 81" width="81" height="81"><circle cx="40.5" cy="27" r="13.5" fill="none" stroke="#999999" stroke-width="5"/><path d="M13.5 67.5c0-13.5 13.5-23.5 27-23.5s27 10 27 23.5" fill="none" stroke="#999999" stroke-width="5" stroke-linejoin="round"/></svg>`,
  'mine-active': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81 81" width="81" height="81"><circle cx="40.5" cy="27" r="13.5" fill="#3182CE"/><path d="M13.5 67.5c0-13.5 13.5-23.5 27-23.5s27 10 27 23.5" fill="#3182CE"/></svg>`
};

const tabDir = path.join(__dirname, '..', 'src', 'static', 'tab');

if (!fs.existsSync(tabDir)) {
  fs.mkdirSync(tabDir, { recursive: true });
}

// Save SVG files first
icons.forEach(icon => {
  const svgPath = path.join(tabDir, `${icon.name}.svg`);
  fs.writeFileSync(svgPath, svgTemplates[icon.name], 'utf8');
  console.log(`Saved ${icon.name}.svg`);
});

console.log('\nAll SVG icons saved to src/static/tab/');
console.log('\nPlease use the convert.html file to manually download PNG files,');
console.log('or use an online converter to convert SVG to PNG.');
console.log('The required PNG sizes are 81x81 pixels.');
