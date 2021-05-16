/*---
title: Second Page
---*/

import React from "react"
import Name from "./_includes/name"

export default function Second(props: any): React.ReactElement {
  return (
    <div>
      {props.title}
      <Name />
    </div>
  )
}
