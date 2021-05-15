/*---
title: Homepage
---*/

import React from "react"
import { renderSync } from "sass"

export default function Index(props: any): React.ReactElement {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: renderSync({
          data: `
            $color: blue;
            body { background-color: $color; }
          `
        }).css.toString()
      }}
    />
  )
}
