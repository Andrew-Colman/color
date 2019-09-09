import styled from "@emotion/styled"
import {
  space,
  width,
  maxWidth,
  display,
  fontSize,
  fontWeight,
  lineHeight,
  textAlign,
  color,
  borderRadius
} from "styled-system"

const Label = styled.label(
  space,
  width,
  maxWidth,
  display,
  fontSize,
  fontWeight,
  lineHeight,
  textAlign,
  color,
  borderRadius,
  {}
)

Label.defaultProps = {}

export default Label
