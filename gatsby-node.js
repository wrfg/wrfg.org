const path = require(`path`)

const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/")
      }
    },
  })
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const relativePath = path.relative(`${__dirname}/content/`, node.fileAbsolutePath)
    const kind = relativePath.split(path.sep)[0]

    const slug = createFilePath({ node, getNode, basePath: kind === "pages" ? `pages/` : `` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })

    createNodeField({
      node,
      name: `kind`,
      value: kind,
    })
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
              kind
            }
          }
        }
      }
    }
  `)

  result.data.allMarkdownRemark.edges.map((edge) => edge.node).forEach((node) => {
    reporter.info(`New page at ${node.fields.slug} and it's a ${node.fields.kind}`)
    createPage({
      path: node.fields.slug,
      component: path.resolve(`src/templates/${node.fields.kind}/single.js`),
      context: {
        slug: node.fields.slug
      }
    })
  })
}
