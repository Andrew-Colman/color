import React, { useState, useEffect } from "react"
import { withRouter } from "next/router"
import { get as getIdb, set as setIdb } from "idb-keyval"
import palx from "palx"
import useHistory from "../utils/useHistory"
import useInterval from "../utils/useInterval"
import queryString from "query-string"
import isEmpty from "lodash/isEmpty"
import isArray from "lodash/isArray"
import uniqWith from "lodash/uniqWith"
import isEqual from "lodash/isEqual"
import toNumber from "lodash/toNumber"
import reduce from "lodash/reduce"
import IconOutlineBlock from "../components/IconOutlineBlock"
import theme from "../theme"

import defaultPalette from "../utils/defaultPalette"
import generateRandomPalette from "../utils/generateRandomPalette"
import sortPalette from "../utils/sortPalette"
import ColorPicker from "../components/ColorPicker"
import Color from "color"

const encodeCombination = currentCombination => {
  return queryString.stringify(currentCombination)
}

const resetPinned = {
  color: false,
  bg: false,
  borderColor: false,
  parentBg: false
}

const Index = ({ router }) => {
  const [palette, setPalette] = useState(sortPalette(defaultPalette))
  const [likes, updateLikes] = useState([])
  const [contrastRatio, setContrastRatio] = useState(4.5)
  const [colorFilter, setColorFilter] = useState("none")
  const [paletteImage, setPaletteImage] = useState(null)
  const [imageName, setImageName] = useState("")
  const [currentState, { set, undo, redo, canRedo, canUndo }] = useHistory({})
  const { present: currentCombination } = currentState
  const [pinnedColors, setPinnedColors] = useState(resetPinned)
  const [withBorders, setWithBorders] = useState(true)
  const [borderWidth, setBorderWidth] = useState(0)
  const [palxColor, setPalxColor] = useState("#07c")
  const [palxColorContrast, setPalxColorContrast] = useState(true)
  const [currentPickerColor, setPickerColor] = useState(null)
  const { start, stop, isRunning } = useInterval({
    duration: 2000,
    startImmediate: true,
    callback: () => {
      const newCombo = generateRandomPalette(
        palette,
        pinnedColors,
        currentCombination,
        contrastRatio
      )
      set(newCombo)
    }
  })

  useEffect(() => {
    getIdb("likes").then(likes => {
      likes && updateLikes(likes)
    })
  }, [])

  useEffect(() => {
    const starterCombination = isEmpty(router.query)
      ? generateRandomPalette(
          palette,
          pinnedColors,
          currentCombination,
          contrastRatio
        )
      : router.query
    set(starterCombination)
  }, [])

  useEffect(
    () => {
      router.push("/", `?${encodeCombination(currentCombination)}`)
    },
    [currentCombination]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  })

  const handleAutoCycling = () => {
    isRunning ? stop() : start()
  }

  const handleLike = async () => {
    const currentLikes = await likes

    const deDuped = uniqWith([...currentLikes, currentCombination], isEqual)
    updateLikes(deDuped)
    await setIdb("likes", deDuped)
  }

  const handleRemoveLike = async index => {
    const newLikes = likes.filter((_, i) => index !== i)
    updateLikes(newLikes)
    await setIdb("likes", newLikes)
  }

  const handleNext = () => {
    if (canRedo) {
      return redo()
    }
    isRunning && stop()
    const newCombo = generateRandomPalette(
      palette,
      pinnedColors,
      currentCombination,
      contrastRatio
    )
    set(newCombo)
  }

  const handlePrevious = () => {
    if (canUndo) {
      stop()
      undo()
    }
  }

  const handleViewLike = index => {
    isRunning && stop()
    set(likes[index])
  }

  const handleRemove = index => {
    const alteredPalette = palette.filter((_, i) => index !== i)
    setPalette(alteredPalette)
  }

  const handleColorUpdate = (e, index) => {
    const updatedPalette = [...palette]
    updatedPalette[index] = e.target.value
    setPalette(updatedPalette)
  }

  const handleAddColor = newColor =>
    newColor.length > 0 && setPalette([...palette, newColor])

  const handleKeyPress = ({ key }) => {
    switch (key) {
      case "ArrowUp":
        handleLike()
        break
      case "ArrowRight":
        handleNext()
        break
      case "ArrowLeft":
        handlePrevious()
        break
    }
  }

  const handleColorBlindFilter = e => setColorFilter(e.target.value)

  const handleSiteFetch = async palette => {
    setPalette(palette)
    setPinnedColors(resetPinned)
    const newCombo = generateRandomPalette(
      palette,
      resetPinned,
      null,
      contrastRatio
    )
    set(newCombo)
  }

  const handleClearPalette = () => {
    const clearedPalette = ["#000000", "#FFFFFF", "#2c7cb0", "#757575"]
    setPalette(clearedPalette)
    const newCombo = generateRandomPalette(
      clearedPalette,
      resetPinned,
      null,
      contrastRatio
    )
    set(newCombo)
    setImageName(new Date())
    setPaletteImage("")
  }

  const handlePinColor = key => () => {
    setPinnedColors(prevState => ({ ...prevState, [key]: !prevState[key] }))
  }

  const handleShowEditTooltip = () => {
    isRunning && stop()
  }

  const handleComboColorUpdate = (newColor, tooltipKey) => {
    const newCombo = { ...currentCombination, [tooltipKey]: newColor }
    set(newCombo)
  }

  const handleImageUpload = async e => {
    setPaletteImage(URL.createObjectURL(e.target.files[0]))

    const res = await fetch("https://image-palette.now.sh", {
      method: "POST",
      body: e.target.files[0]
    })
    const palette = await res.json()

    setPalette(palette)
    setPinnedColors(resetPinned)
    const newCombo = generateRandomPalette(
      palette,
      resetPinned,
      null,
      contrastRatio
    )
    set(newCombo)
  }

  const handleBorderToggle = () => setWithBorders(value => !value)

  const handleBorderWidthChange = e => setBorderWidth(parseInt(e.target.value))

  const handleFetchFromUnsplash = async () => {
    const res = await fetch("https://unsplash-palette.now.sh")
    const { colors, url } = await res.json()
    setPalette(colors)
    setPinnedColors(resetPinned)
    const newCombo = generateRandomPalette(
      palette,
      resetPinned,
      null,
      contrastRatio
    )
    set(newCombo)
    setPaletteImage(url)
  }

  const handlePalxColor = e => {
    setPalxColor(e.target.value)
  }

  const handleUsePalx = () => {
    const newPaletteObj = palx(palxColor)

    const newPalette = reduce(
      newPaletteObj,
      (acc, curr) => {
        return isArray(curr) ? [...acc, ...curr] : acc
      },
      []
    )
    setPalette(newPalette)
    setPinnedColors(resetPinned)
    const newCombo = generateRandomPalette(
      newPalette,
      resetPinned,
      null,
      contrastRatio
    )
    set(newCombo)
  }

  const handlePaletteColorClick = (index, color) => {
    setPickerColor({ index, color })
  }

  const handleSetEditColor = color => {
    isRunning && stop()

    const updatedPalette = [...palette]
    updatedPalette[currentPickerColor.index] = color

    setPalette(updatedPalette)
    setPickerColor(prevPicker => ({ index: prevPicker.index, color }))
  }

  const handleContrastRatioChange = e => {
    setContrastRatio(toNumber(e.target.value))
  }

  return (
    <Div
      display="flex"
      flexWrap="wrap"
      bg={currentCombination.parentBg}
      width={1}
      position="relative"
      style={{
        overflow: "hidden",
        filter:
          colorFilter === "none"
            ? "none"
            : `url(/static/filters.svg#${colorFilter})`
      }}
    >
      <Div bg="white" display="flex" alignItems="center" width={1}>
        <Div width={1 / 4} py={2} pl={3}>
          <Logo />
        </Div>
        <CombinationTools
          currentCombination={currentCombination}
          pinnedColors={pinnedColors}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onPinColor={handlePinColor}
          onLike={handleLike}
          onShowEditTooltip={handleShowEditTooltip}
          onAutoCycling={handleAutoCycling}
          isRunning={isRunning}
          onComboColorUpdate={handleComboColorUpdate}
        />
      </Div>

      <Div
        width={[1, 1 / 4]}
        bg="rgba(255,255,255,1)"
        borderTop="1px solid rgba(0,0,0,.1)"
        borderRight="1px solid rgba(0,0,0,.1)"
        color="black"
        pt={3}
        pb={4}
        style={{ minHeight: "100vh" }}
      >
        <Div pb={2} px={3}>
          <TextButton mr={3} fontWeight={700} fontSize={2}>
            URL
          </TextButton>
          <TextButton mr={3} fontWeight={700} fontSize={2}>
            Image
          </TextButton>
          <TextButton mr={3} fontWeight={700} fontSize={2} color="blue.4">
            Generative
          </TextButton>
        </Div>

        {!paletteImage && (
          <Div px={3}>
            <SiteFetch onSubmit={handleSiteFetch} />
          </Div>
        )}

        <Flex mt={3} mb={2} px={3}>
          <Div width={1 / 2}>
            <Input
              border="1px solid rgba(0,0,0,.1)"
              py={3}
              width={1}
              pl={3}
              key={imageName}
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={handleImageUpload}
            />
          </Div>
          <Div width={1 / 2} textAlign="right">
            <Button
              bg="white"
              border="1px solid black"
              fontSize={1}
              borderRadius={2}
              py={2}
              px={3}
              ml="auto"
              display="flex"
              justifyContent="center"
              width={"auto"}
              alignItems="center"
              fontWeight={700}
              onClick={handleFetchFromUnsplash}
            >
              <Icon viewBox="0 0 32 32" size={16} type="unsplash" />
              <Span pl={1}>Unsplash photo</Span>
            </Button>
          </Div>
        </Flex>
        {paletteImage && (
          <Div p={2} border="1px solid rgba(0,0,0,.1)">
            <Img src={paletteImage} />
          </Div>
        )}

        <Div>
          <Div
            fontWeight={700}
            mt={3}
            mb={2}
            display="flex"
            flexWrap="wrap"
            alignItems="center"
          >
            {!paletteImage && (
              <Div width={1} mb={4} px={3}>
                <Label mb={2} display="block">
                  Base Color
                </Label>
                <Flex>
                  <TextInput
                    width={48}
                    fontSize={2}
                    py={3}
                    readOnly
                    border={0}
                    bg={palxColor}
                  />
                  <TextInput
                    type="text"
                    value={palxColor}
                    onChange={handlePalxColor}
                    fontSize={2}
                    fontWeight={700}
                    py={3}
                    px={3}
                    width={[3 / 4]}
                    type="url"
                    border="0"
                    bg="gray.8"
                    borderRadius={0}
                  />
                  <Button
                    py={3}
                    width={1 / 4}
                    fontSize={2}
                    bg="black"
                    color="white"
                    fontWeight={700}
                    border="none"
                    style={{ cursor: "pointer", minWidth: 128 }}
                    onClick={handleUsePalx}
                  >
                    Generate
                  </Button>{" "}
                </Flex>
              </Div>
            )}
            <Div px={3}>
              <Flex mb={2}>
                <Label fontWeight={700}>Palette</Label>
                <TextButton ml="auto" onClick={handleClearPalette}>
                  Clear
                </TextButton>
              </Flex>
              <Palette
                palette={palette}
                activeColors={Object.values(currentCombination)}
                onClick={handlePaletteColorClick}
                onAddColor={handleAddColor}
              />
            </Div>
          </Div>

          {currentPickerColor && (
            <Div>
              <ColorPicker
                currentColor={currentPickerColor.color}
                onChange={handleSetEditColor}
              />
            </Div>
          )}

          <Div mt={4} px={3}>
            <Div>
              <Label fontWeight={700} fontSize={2} mr={2}>
                Border width
              </Label>
              <Input
                value={borderWidth}
                onChange={handleBorderWidthChange}
                type="number"
                py={2}
                px={2}
                fontSize={2}
                fontWeight={600}
                borderRadius={2}
                border={"1px solid " + theme.colors.gray[8]}
                min={0}
                max={32}
                step={1}
              />
            </Div>
          </Div>
        </Div>

        <Form mt={3} px={3}>
          <Fieldset border="0" p={0}>
            <Legend fontWeight={700} fontSize={3}>
              Contrast Ratio
            </Legend>
            <Flex mx={-3} py={2}>
              <Flex px={3}>
                <Input
                  type="radio"
                  name="contrastRatio"
                  value={3}
                  onChange={handleContrastRatioChange}
                  checked={contrastRatio === 3}
                  mr={2}
                />
                <Label>
                  <Span fontWeight={800}>3:1</Span> AA large
                </Label>
              </Flex>
              <Flex px={3}>
                <Input
                  type="radio"
                  name="contrastRatio"
                  value={4.5}
                  onChange={handleContrastRatioChange}
                  checked={contrastRatio === 4.5}
                  mr={2}
                />
                <Label>
                  <Span fontWeight={800}>4.5:1</Span> AA
                </Label>
              </Flex>
              <Flex px={3}>
                <Input
                  type="radio"
                  name="contrastRatio"
                  value={7}
                  onChange={handleContrastRatioChange}
                  checked={contrastRatio === 7}
                  mr={2}
                />
                <Label>
                  <Span fontWeight={800}>7:1</Span> AAA
                </Label>
              </Flex>
            </Flex>
          </Fieldset>
        </Form>

        <Div px={3}>
          <ColorBlindFilter
            onChange={handleColorBlindFilter}
            currentValue={colorFilter}
          />
          <Likes
            likes={likes}
            onSelectLike={handleViewLike}
            onRemoveLike={handleRemoveLike}
          />
          <Div
            display="flex"
            mt={2}
            borderTop="1px solid rgba(0,0,0,.2)"
            py={3}
          >
            <A
              display="block"
              href="https://cloudflare.design"
              fontWeight={700}
            >
              Cloudflare Design
            </A>
            <A
              href="https://github.com/cloudflare-design"
              ml="auto"
              fontSize={2}
              color="blue.4"
              display="block"
              fontWeight={700}
            >
              GitHub
            </A>
          </Div>
        </Div>
      </Div>

      {!isEmpty(currentCombination) && (
        <Div width={3 / 4} pb={5} pt={4} borderTop="1px solid rgba(0,0,0,.1)">
          <Div maxWidth="48em" mx="auto">
            <TextBlock
              withBorders={withBorders}
              borderWidth={borderWidth}
              currentCombination={currentCombination}
            />
            <IconOutlineBlock
              currentCombination={currentCombination}
              withBorders={withBorders}
              borderWidth={borderWidth}
            />

            <IconBlock
              currentCombination={currentCombination}
              withBorders={withBorders}
              borderWidth={borderWidth}
            />
            <FormBlock
              currentCombination={currentCombination}
              withBorders={withBorders}
              borderWidth={borderWidth}
            />
            <ChartsBlock
              currentCombination={currentCombination}
              withBorders={withBorders}
              borderWidth={borderWidth}
            />
          </Div>
        </Div>
      )}
    </Div>
  )
}

export default withRouter(Index)
