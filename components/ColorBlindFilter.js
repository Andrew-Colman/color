import React from "react"

const filters = [
  { label: "None", value: "none", population: "92%" },
  { label: "Deuteranomaly", value: "deuteranomaly", population: "2.7%" },
  { label: "Protanomaly", value: "protanomaly", population: "0.66%" },
  { label: "Protanopia", value: "protanopia", population: "0.59%" },
  { label: "Deuteranopia", value: "deuteranopia", population: "0.56%" },
  { label: "Tritanopia", value: "tritanopia", population: "0.016%" },
  { label: "Tritanomaly", value: "tritanomaly", population: "0.01%" },
  { label: "Achromatopsia", value: "achromatopsia", population: "<0.0001%" },
  { label: "Achromatomaly", value: "achromatomaly", population: "Unknown %" }
]

const SingleRadio = ({
  label,
  value,
  population,
  onChange,
  currentValue,
  controlColor
}) => (
  <Div display="flex" alignItems="center" width={1} flexWrap="wrap" mb={2}>
      <Input
        type="radio"
        checked={currentValue === value}
        name="colorFilter"
        id={label}
        value={value}
        onChange={onChange}
      />
    <Label pl={1} htmlFor={label}>
      <Span>{label}</Span>
    </Label>
    <Span  ml="auto" fontSize={1} lineHeight={1.5}>
      <b>{population}</b>
    </Span>
  </Div>
)

const ColorBlindFilter = ({ onChange, currentValue, controlColor, ...props }) => {
  return (
    <Div display="flex" flexWrap="wrap" {...props}>
      <H4  width={1} mb={2} mt={4} display="flex" alignItems='flex-end'>
        <Span>Color Blindness Filter</Span>
        <Span ml="auto" fontSize={1}>
          Population
        </Span>
      </H4>

      {filters.map(f => (
        <SingleRadio
          key={f.label}
          label={f.label}
          value={f.value}
          population={f.population}
          onChange={onChange}
          currentValue={currentValue}
        />
      ))}
    </Div>
  )
}

export default ColorBlindFilter
