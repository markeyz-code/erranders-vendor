const fs = require('fs');
const file = '/Users/marquis/erranders/vendor/components/dashboard/ProductDrawer.vue';
let content = fs.readFileSync(file, 'utf8');

// Reduce global spacing
content = content.replace(/space-y-8/g, 'space-y-4');
content = content.replace(/space-y-5/g, 'space-y-3');

// Reduce input padding and fix borders
content = content.replace(/px-4 py-3 bg-white border border-gray-25/g, 'px-3 py-2 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white');
content = content.replace(/focus:ring-2 focus:ring-gray-900 focus:border-gray-900/g, 'focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A]');
content = content.replace(/focus:ring focus:ring-gray-900 focus:border-gray-900/g, 'focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A]');
content = content.replace(/px-3 py-2 bg-white border border-gray-25/g, 'px-3 py-2 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white');

// Change focus colors
content = content.replace(/focus:border-gray-900/g, 'focus:border-[#FF5C1A]');

fs.writeFileSync(file, content);
console.log('Fixed ProductDrawer classes');
