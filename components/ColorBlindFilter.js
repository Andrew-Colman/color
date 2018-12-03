import React from "react"

import Div from "../elements/Div"
import H4 from "../elements/H4"
import Input from "../elements/Input"
import Label from "../elements/Label"

const filters = [
  { label: "None", value: "none" },
  { label: "Achromatopsia", value: "achromatopsia" },
  { label: "Protanopia", value: "protanopia" },
  { label: "Protanomaly", value: "protanomaly" },
  { label: "Deuteranopia", value: "deuteranopia" },
  { label: "Deuteranomaly", value: "deuteranomaly" },
  { label: "Tritanopia", value: "tritanopia" },
  { label: "Tritanomaly", value: "tritanomaly" },
  { label: "Achromatomaly", value: "achromatomaly" }
]

const SingleRadio = ({ label, value, onChange, currentValue }) => (
  <Div display="flex" alignItems="center" width="auto" width={1}>
    <Input
      type="radio"
      checked={currentValue === value}
      name="colorFilter"
      id={label}
      value={value}
      onChange={onChange}
    />
    <Label pl={1} htmlFor={label}>
      {label}
    </Label>
  </Div>
)

const ColorBlindFilter = ({ onChange, currentValue }) => {
  return (
    <Div display="flex" flexWrap="wrap">
      <H4 width={1} mb={2} mt={4}>
        Color Blindness Filter
      </H4>

      {filters.map(f => (
        <SingleRadio
          key={f.label}
          label={f.label}
          value={f.value}
          onChange={onChange}
          currentValue={currentValue}
        />
      ))}
    </Div>
  )
}

export default ColorBlindFilter
