import { Server } from 'src/entities/server'
import { Timeline } from 'src/entities/timeline'
import ShowTimeline from 'src/components/timelines/Timeline'
import ShowNotifications from 'src/components/timelines/Notifications'
import { Unread } from 'src/entities/unread'

type Props = {
  timeline: Timeline
  server: Server
  unreads: Array<Unread>
  setUnreads: (a: Array<Unread>) => void
}

const Show: React.FC<Props> = props => {
  if (props.timeline.timeline === 'notifications') {
    return <ShowNotifications timeline={props.timeline} server={props.server} unreads={props.unreads} setUnreads={props.setUnreads} />
  } else {
    return <ShowTimeline timeline={props.timeline} server={props.server} />
  }
}

export default Show
