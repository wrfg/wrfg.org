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

    const program = new Program(data)
    if (!program.title) {
      return null
    }

    return program
  }
}

export default Program
