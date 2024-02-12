import React from 'react'

const Card = ({children, cardClass}) => {
  return <div className={`${cardClass}`}>{children}</div>
}

export default Card
