import React, { useState, useEffect } from "react"
import Color from "color"

const getHex = val => {
  try {
    return Color(val).hex()
  } catch (e) {
    return null
  }
}

const getRGB = val => {
  try {
    return Color(val)
      .rgb()
      .object()
  } catch (e) {
    return {}
  }
}

const getHSL = val => {
  try {
    return Color(val)
      .hsl()
      .object()
  } catch (e) {
    return {}
  }
}

const getColorValues = val => {
  const hex = getHex(val)
  const rgb = getRGB(val)
  const hsl = getHSL(val)
  return {
    hex,
    rgb,
    hsl
  }
}

const ColorPicker = ({ currentColor, onChange }) => {
  const [colorValues, setColorValues] = useState(() =>
    getColorValues(currentColor)
  )

  useEffect(
    () => {
      const next = Color(currentColor)
      const newState = {
        hex: next.hex(),
        rgb: next.rgb().object(),
        hsl: next.hsl().object()
      }
      setColorValues(newState)
    },
    [currentColor]
  )

  const handleHexChange = e => {
    const val = e.target.value
    setColorValues(prevValue => ({ ...prevValue, hex: val }))
    try {
      const next = Color(val).hex()
      onChange(next)
    } catch (e) {
      return
    }
  }

  const handleRGBChange = e => {
    const val = e.target.value
    const name = e.target.name

    const rgbValue = { ...colorValues.rgb, [name]: val }
    setColorValues(prevValue => ({
      ...prevValue,
      rgb: rgbValue
    }))

    try {
      const next = Color(rgbValue).hex()
      onChange(next)
    } catch (e) {
      return
    }
  }

  const handleHSLChange = e => {
    const val = e.target.value
    const name = e.target.name

    const hslValue = { ...colorValues.hsl, [name]: val }
    setColorValues(prevValue => ({
      ...prevValue,
      hsl: hslValue
    }))

    try {
      const next = Color(hslValue).hex()
      onChange(next)
    } catch (e) {
      return
    }
  }

  const getContrastRatio = (currentColor, otherColor) => {
    return Color(currentColor)
      .contrast(Color(otherColor))
      .toFixed(2)
  }

  const contrastForBlack = currentColor => {
    return getContrastRatio(currentColor, "black")
  }

  const contrastForWhite = currentColor => {
    return getContrastRatio(currentColor, "white")
  }

  const showContrastLevel = ratio => {
    if (ratio < 3) {
      return "Fail" 
    } else if (ratio > 3 && ratio < 4.5) {
      return "AA large"
    } else if (ratio >= 4.5 && ratio < 7) {
      return "AA"
    } else if (ratio >= 7) {
      return "AAA"
    }
    return ""
  }

  return (
    <Div
      px={4}
      pt={4}
      pb={5}
      color={
        Color(currentColor).isLight()
          ? "rbga(0,0,0,.75)"
          : "rgba(255,255,255,.85)"
      }
      bg={currentColor}
      mt={3}
      display="flex"
      flexWrap="wrap"
    >
      
      <TextInput
        width={1}
        color="inherit"
        bg="transparent"
        border={0}
        fontSize={5}
        fontWeight={800}
        value={colorValues.hex}
        onChange={handleHexChange}
        px={0}
        css={{ transition: "none" }}
      />
      <Flex mx={-4}>
      <Flex flexWrap='wrap' width={1/2} px={4}>
        <Flex flexWrap="wrap">
        <Label color="inherit" fontWeight={700} css={{ transition: "none" }}>
          Red
        </Label>
        <TextInput
          type="number"
          border={0}
          color="inherit"
          bg="transparent"
          width="auto"
          min="0"
          max="255"
          fontSize={3}
          name="r"
          value={Math.floor(colorValues.rgb.r)}
          onChange={handleRGBChange}
          css={{ transition: "none" }}
        />
        <Div width={1}>
          <Input
            name="r"
            type="range"
            min="0"
            max="255"
            step="1"
            width={1}
            value={colorValues.rgb.r}
            onChange={handleRGBChange}
          />
        </Div>
      </Flex>
      <Flex width={1} flexWrap="wrap">
        <Label fontWeight={700} color="inherit" css={{ transition: "none" }}>
          Green
        </Label>
        <TextInput
          name="g"
          type="number"
          color="inherit"
          fontSize={3}
          bg="transparent"
          border={0}
          width='auto'
          min="0"
          max="255"
          value={Math.floor(colorValues.rgb.g)}
          onChange={handleRGBChange}
          css={{ transition: "none" }}
        />
        <Div width={1}>
          <Input
            name="g"
            type="range"
            width={1}
            min="0"
            max="255"
            step="1"
            value={colorValues.rgb.g}
            onChange={handleRGBChange}
          />
        </Div>
      </Flex>
      <Flex width={1} flexWrap="wrap">
        <Label color="inherit" fontWeight={700} css={{ transition: "none" }}>
          Blue
        </Label>
        <TextInput
          name="b"
          type="number"
          border={0}
          fontSize={3}
          bg="transparent"
          width="auto"
          color="inherit"
          min="0"
          max="255"
          value={Math.floor(colorValues.rgb.b)}
          onChange={handleRGBChange}
          css={{ transition: "none" }}
        />
        <Div width={1}>
          <Input
            name="b"
            type="range"
            min="0"
            max="255"
            step="1"
            width={1}
            value={colorValues.rgb.b}
            onChange={handleRGBChange}
          />
        </Div>
      </Flex>
      </Flex>
      <Flex flexWrap="wrap" width={1/2} px={4}>
        <Flex flexWrap="wrap">
          <Label fontWeight={700} color="inherit" css={{ transition: "none" }}>
            H
          </Label>
          <TextInput
            name="h"
            type="number"
            width="auto"
            bg="transparent"
            color="inherit"
            border={0}
            fontSize={3}
            min="0"
            max="360"
            onChange={handleHSLChange}
            value={Math.floor(colorValues.hsl.h)}
            css={{ transition: "none" }}
          />
          <Div width={1}>
            <Input
              name="h"
              type="range"
              width={1}
              min="0"
              max="360"
              step="1"
              value={colorValues.hsl.h}
              onChange={handleHSLChange}
            />
          </Div>
        </Flex>
        <Flex flexWrap="wrap">
          <Label fontWeight={700} color="inherit" css={{ transition: "none" }}>
            S
          </Label>
          <TextInput
            name="s"
            type="number"
            width="auto"
            bg="transparent"
            color="inherit"
            border={0}
            fontSize={3}
            min="0"
            max="100"
            onChange={handleHSLChange}
            value={Math.floor(colorValues.hsl.s)}
            css={{ transition: "none" }}
          />
          <Div width={1}>
            <Input
              name="s"
              type="range"
              width={1}
              min="0"
              max="100"
              step="1"
              value={colorValues.hsl.s}
              onChange={handleHSLChange}
            />
          </Div>
        </Flex>
        <Flex flexWrap="wrap">
          <Label fontWeight={700} color="inherit" css={{ transition: "none" }}>
            L
          </Label>
          <TextInput
            name="l"
            type="number"
            width="auto"
            bg="transparent"
            color="inherit"
            border={0}
            fontSize={3}
            min="0"
            max="100"
            value={Math.floor(colorValues.hsl.l)}
            onChange={handleHSLChange}
            css={{ transition: "none" }}
          />
          <Div width={1}>
            <Input
              name="l"
              type="range"
              width={1}
              min="0"
              max="100"
              step="1"
              value={colorValues.hsl.l}
              onChange={handleHSLChange}
            />
          </Div>
        </Flex>
      </Flex>
    </Flex>
<Flex width={1} mt={4} flexWrap='wrap'>
  <Div width={1/2}>
          <P m={0} fontSize={2} color="inherit" css={{ transition: "none" }}>
            With black
          </P>
          <Div
            display='flex'
            alignItems='center'
            fontSize={5}
            fontWeight={700}
            m={0}
            color='inherit'
            css={{ transition: "none" }}
          >
            <Span pr={2} fontWeight={700}> {contrastForBlack(currentColor)}</Span>
            <Span fontWeight={700} fontSize={2} py={1} px={2} color={currentColor} bg='black' borderRadius={2}>{showContrastLevel(contrastForBlack(currentColor))}</Span>
          </Div>
        </Div>
        <Div width={1/2} px={4}>
          <P m={0} fontSize={2} color="inherit" css={{ transition: "none" }}>
            With white
          </P>
          <Div
            display='flex'
            alignItems='center'
            color='inherit'
            fontSize={5}
            fontWeight={4}
            m={0}
            css={{ transition: "none" }}
          >
            <Span pr={2} fontWeight={700}>{contrastForWhite(currentColor)}</Span>
            <Span fontWeight={700} fontSize={2} color={currentColor} bg='white' borderRadius={2} py={1} px={2}>{showContrastLevel(contrastForWhite(currentColor))}</Span>
          </Div>
        </Div>
      </Flex>
    </Div>
  )
}

export default React.memo(ColorPicker)
