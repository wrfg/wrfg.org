/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-plugin-emotion`,
    `gatsby-plugin-react-helmet-async`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-163337999-1`,
      },
    },
  ],
}
