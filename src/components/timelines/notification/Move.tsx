import { Icon } from '@rsuite/icons'
import { Entity } from 'megalodon'
import { BsBag } from 'react-icons/bs'
import { useIntl } from 'react-intl'
import { Avatar, FlexboxGrid } from 'rsuite'
import Time from 'src/components/utils/Time'
import emojify from 'src/utils/emojify'

type Props = {
  notification: Entity.Notification
  setAccountDetail: (account: Entity.Account) => void
}

export default function Move(props: Props) {
  return (
    <div onClick={() => props.setAccountDetail(props.notification.target)} style={{ cursor: 'pointer' }}>
      {/** action **/}
      <FlexboxGrid style={{ paddingRight: '8px' }}>
        <FlexboxGrid.Item colspan={20} style={{ display: 'flex', alignItems: 'middle' }}>
          {/** icon **/}
          <div style={{ paddingRight: '8px', textAlign: 'right', width: '56px' }}>
            <Icon as={BsBag} color="cyan" />
          </div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{actionText(props.notification)}</div>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={4} style={{ textAlign: 'right', color: 'var(--rs-text-tertiary)' }}>
          <Time time={props.notification.created_at} />
        </FlexboxGrid.Item>
      </FlexboxGrid>
      {/** body **/}
      <div style={{ display: 'flex' }}>
        <div style={{ width: '56px' }}>
          <div style={{ margin: '6px' }}>
            <Avatar
              src={props.notification.target.avatar}
              onClick={() => props.setAccountDetail(props.notification.target)}
              title={props.notification.target.acct}
              alt={props.notification.target.acct}
            />
          </div>
        </div>
        <div style={{ paddingRight: '8px', overflowWrap: 'break-word' }}>
          <div>
            <span dangerouslySetInnerHTML={{ __html: emojify(props.notification.target.display_name, props.notification.target.emojis) }} />
          </div>
          <div style={{ color: 'var(--rs-text-secondary)' }}>{props.notification.target.acct}</div>
        </div>
      </div>
    </div>
  )
}

const actionText = (notification: Entity.Notification) => {
  const { formatMessage } = useIntl()

  switch (notification.type) {
    case 'move':
      return (
        <span
          style={{ color: 'var(--rs-text-secondary)' }}
          dangerouslySetInnerHTML={{
            __html: emojify(
              formatMessage({ id: 'timeline.notification.move.body' }, { user: notification.account.display_name }),
              notification.account.emojis
            )
          }}
        />
      )
    default:
      return null
  }
}
