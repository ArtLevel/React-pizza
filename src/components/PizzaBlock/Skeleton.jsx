import React from 'react'
import ContentLoader from 'react-content-loader'

const PizzaSkeleton = () => (
  <ContentLoader
    className='pizza-block'
    speed={2}
    width={280}
    height={465}
    viewBox='0 0 280 465'
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
  >
    <rect x='0' y='268' rx='10' ry='10' width='280' height='25' />
    <rect x='0' y='315' rx='10' ry='10' width='280' height='88' />
    <circle cx='140' cy='125' r='125' />
    <rect x='120' y='425' rx='25' ry='25' width='160' height='40' />
    <rect x='-1' y='435' rx='10' ry='10' width='70' height='25' />
  </ContentLoader>
)

export default PizzaSkeleton
