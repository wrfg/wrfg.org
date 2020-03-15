import Show from "./show"

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
  get shows() {
    return (this.data.shows || []).map((show) => Show.factory(show))
  }
  static factory(data) {
    if (!data) {
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
