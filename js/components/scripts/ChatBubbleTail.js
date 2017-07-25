// @flow
import React from 'react'
import Svg, {
  Path,
} from 'react-native-svg'

const Right = ({ color }) => (
  <Path
    d="M.02 3.494c5.74.7 9.14-.264 10.197-2.89.276 2.08-2.474 8.72-6.498 9.05C1.91 6.646.676 4.594.02 3.494z"
    fill={ color }
    fill-rule="evenodd"
  />
)

const Left = ({ color }) => (
  <Path
    d="M10.236 3.494c-5.74.7-9.14-.264-10.198-2.89-.277 2.08 2.474 8.72 6.498 9.05 1.808-3.008 3.042-5.06 3.7-6.16z"
    fill={ color }
    fill-rule="evenodd"
  />
)

const ChatBubbleTail = ({ color, direction }) => (
  <Svg width="11" height="10" viewBox="0 0 11 10">
    { direction == 'RIGHT'
        ? <Right color={ color } />
        : <Left color={ color } />
    }
  </Svg>
)

export default ChatBubbleTail
