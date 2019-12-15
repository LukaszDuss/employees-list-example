const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
// const postcssPurgecss = require(`@fullhuman/postcss-purgecss`);

module.exports = {
    plugins: [
      tailwindcss,
      autoprefixer,
    //  ...process.env.NODE_ENV === 'production'
    ///    ? [purgecss]
    //    : [],
    ],
  }