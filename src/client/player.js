import Loadable from "@loadable/component"

const Player = () => {
  const date = new Date()
  return "FM It is " + date.toLocaleString()
}

export default Player

const LoadablePlayer = Loadable(() => import("./player"))

export { LoadablePlayer }
