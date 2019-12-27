class Program {
  constructor(data) {
    this.data = data
  }
  get title() {
    return this.data.frontmatter.title
  }
  get slug() {
    return this.data.fields.slug
  }
  static factory(data) {
    if (data === null) {
      return null
    }

    return new Program(data)
  }
}

export default Program
