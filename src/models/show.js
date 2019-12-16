import { LocalTime, Duration } from "@js-joda/core"

const toLocalTime = (time) => {
  let hours = parseInt(time.split(":")[0], 10)
  const minutes = parseInt(time.split(":")[1].substring(0, 2), 10)
  const meridiem = time.slice(-1)

  if (meridiem === "a") {
    if (hours === 12) {
      hours = 0
    }
  } else if (meridiem === "p") {
    if (hours !== 12) {
      hours += 12
    }
  } else {
    throw new Error(`Unparsable time \`${time}\``)
  }

  return LocalTime.of(hours, minutes)
}

const toDuration = (duration) => {
  const [ hours, minutes ] = duration.split(":").map((part) => parseInt(part, 10))
  return Duration.ofHours(hours).plusMinutes(minutes)
}

class Show {
  constructor(data) {
    this.data = data
  }
  get id() {
    return this.data.id
  }
  get slug() {
    return this.data.fields.slug
  }
  get title() {
    return this.data.frontmatter.title
  }
  get day() {
    return this.data.frontmatter.day
  }
  get start() {
    return toLocalTime(this.data.frontmatter.start)
  }
  get duration() {
    return toDuration(this.data.frontmatter.duration)
  }
  get end() {
    return this.start.plus(this.duration)
  }
  static factory(data) {
    return new Show(data)
  }
}

const all = [new Show({title: 'My Show'})]

const dayAsOrdinal = (day) => {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day)
}

const sortByStart = (x, y) => {
  if (dayAsOrdinal(x.day) < dayAsOrdinal(y.day)) {
    return -1
  }

  if (dayAsOrdinal(x.day) > dayAsOrdinal(y.day)) {
    return 1;
  }

  if (x.start.isBefore(y.start)) {
    return -1
  }

  if (x.start.isAfter(y.start)) {
    return 1
  }

  if (x.start.equals(y.start)) {
    return 0
  }

  throw new Error(`Somehow two times are not equal, not greater, and not less than each other`)
}

export default Show
export { all, sortByStart }
