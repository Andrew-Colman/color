import React, { useState, useEffect } from "react"
import OutsideClickHandler from "react-outside-click-handler"

const SingleColor = ({
  color,
  index,
  onRemove,
  onUpdate,
  onClick,
  isActive
}) => {
  const handleRemove = () => onRemove(index)
  const handleUpdate = e => onUpdate(e, index)
  const handleActiveUI = () => onClick(index)

  return (
    <Div
      py={3}
      bg={color}
      css={{ cursor: "pointer", position: "relative" }}
      onClick={handleActiveUI}
    >
      {isActive && (
        <OutsideClickHandler onOutsideClick={() => onClick(null)}>
          <Div
            px={2}
            py={2}
            bg={color}
            width="auto"
            css={{
              position: "absolute",
              transform: "translate(-50%, -100%)",
              top: "-10px",
              left: "50%",
              borderRadius: "5px",
              "&:before": {
                content: "''",
                height: 0,
                width: 0,
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translate(-50%, 100%)",
                border: "10px solid transparent",
                "border-top-color": `${color}`,
                zIndex: 2
              }
            }}
          >
            <TextInput
              type="text"
              value={color}
              onChange={handleUpdate}
              mb={2}
            />
            <ButtonPrimary
              onClick={handleRemove}
              children="Remove"
              button="remove"
            />
          </Div>
        </OutsideClickHandler>
      )}
    </Div>
  )
}

const Palette = ({ palette, onUpdate, onRemove, onAdd }) => {
  const [activeColor, updateActiveColor] = useState(null)

  return (
    <Flex>
      {palette.map((color, i) => (
        <SingleColor
          isActive={i === activeColor}
          key={i}
          color={color}
          index={i}
          onRemove={onRemove}
          onUpdate={onUpdate}
          onClick={updateActiveColor}
        />
      ))}
    </Flex>
  )
}

export default Palette
