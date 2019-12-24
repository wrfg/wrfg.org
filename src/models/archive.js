import Show from "./show.js"

class Archive {
  constructor(data) {
    this.data = data
  }
  get title() {
    return this.data.frontmatter.title
  }
  get slug() {
    return this.data.fields.slug
  }
  get show() {
    return Show.factory(this.data.frontmatter.show)
  }
  get url() {
    return this.data.frontmatter.url
  }
  static factory(data) {
    return new Archive(data)
  }
}

export default Archive
