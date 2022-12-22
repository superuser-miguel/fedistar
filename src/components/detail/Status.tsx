import { Icon } from '@rsuite/icons'
import { Entity, MegalodonInterface } from 'megalodon'
import { useCallback, useEffect, useState } from 'react'
import { BsX } from 'react-icons/bs'
import { Button, Container, Content, Header, List } from 'rsuite'
import { Server } from 'src/entities/server'
import Status from '../timelines/status/Status'

type Props = {
  client: MegalodonInterface
  status: Entity.Status
  server: Server
  onClose: () => void
  openMedia: (media: Entity.Attachment) => void
}

const StatusDetail: React.FC<Props> = props => {
  const [status, setStatus] = useState(props.status)
  const [ancestors, setAncestors] = useState<Array<Entity.Status>>([])
  const [descendants, setDescendants] = useState<Array<Entity.Status>>([])

  useEffect(() => {
    setAncestors([])
    setDescendants([])
    setStatus(props.status)
    const f = async () => {
      const s = await props.client.getStatus(props.status.id)
      setStatus(s.data)
      const c = await props.client.getStatusContext(props.status.id)
      setAncestors(c.data.ancestors)
      setDescendants(c.data.descendants)
    }
    f()
  }, [props.status, props.client])

  const updateStatus = useCallback(
    (updated: Entity.Status) => {
      if (status.id === updated.id) {
        setStatus(updated)
      } else if (status.reblog && status.reblog.id === updated.id) {
        setStatus(Object.assign({}, status, { reblog: updated }))
      } else if (status.reblog && updated.reblog && status.reblog.id === updated.reblog.id) {
        setStatus(Object.assign({}, status, { reblog: updated.reblog }))
      }
      setAncestors(last =>
        last.map(status => {
          if (status.id === updated.id) {
            return updated
          } else if (status.reblog && status.reblog.id === updated.id) {
            return Object.assign({}, status, { reblog: updated })
          } else if (status.reblog && updated.reblog && status.reblog.id === updated.reblog.id) {
            return Object.assign({}, status, { reblog: updated.reblog })
          }
          return status
        })
      )

      setDescendants(last =>
        last.map(status => {
          if (status.id === updated.id) {
            return updated
          } else if (status.reblog && status.reblog.id === updated.id) {
            return Object.assign({}, status, { reblog: updated })
          } else if (status.reblog && updated.reblog && status.reblog.id === updated.reblog.id) {
            return Object.assign({}, status, { reblog: updated.reblog })
          }
          return status
        })
      )
    },
    [status, setStatus, ancestors, setAncestors, descendants, setDescendants]
  )

  return (
    <Container className="status-detail" style={{ height: '100%', borderLeft: '1px solid var(--rs-gray-600)' }}>
      <Header style={{ borderBottom: '4px solid var(--rs-gray-800)', backgroundColor: 'var(--rs-gray-700)' }}>
        <Button appearance="link" onClick={props.onClose}>
          <Icon as={BsX} style={{ fontSize: '1.4em' }} />
        </Button>
      </Header>
      <Content style={{ height: '100%', backgroundColor: 'var(--rs-gray-800)' }}>
        <List hover style={{ width: '340px' }}>
          {[...ancestors, status, ...descendants].map(status => (
            <div key={status.id}>
              <Status
                status={status}
                client={props.client}
                server={props.server}
                updateStatus={updateStatus}
                openMedia={props.openMedia}
                setReplyOpened={() => null}
                style={{ backgroundColor: 'var(--rs-gray-700)' }}
              />
            </div>
          ))}
        </List>
      </Content>
    </Container>
  )
}

export default StatusDetail
