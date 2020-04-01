/** @jsx jsx */
// eslint-disable-next-line import/no-extraneous-dependencies
import { jsx } from "theme-ui";
import { Fragment } from "react";
import cs from "gatsby-theme-docz/src/components";

interface PropDocProps {
  /**
   * @example onClear: () => void
   */
  heading: string;
  description: string;
}
export function PropDoc({ heading, description }: PropDocProps) {
  const [name, annotation] = heading.split(":");

  return (
    <Fragment>
      <cs.h4 sx={{ fontFamily: "monospace" }}>
        {name}:<span sx={{ color: "gray.7" }}>{annotation}</span>
      </cs.h4>
      {description && <p>{description}</p>}
    </Fragment>
  );
}
