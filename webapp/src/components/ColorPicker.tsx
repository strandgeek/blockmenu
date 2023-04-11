import React, { FC, useEffect, useState } from "react";
import { Color, RGBColor } from "react-color";
import { ColorChangeHandler, SketchPicker } from "react-color";

export interface ColorPickerProps {
  onChange: (color: string) => void;
  color: string;
}

export const ColorPicker: FC<ColorPickerProps> = (props) => {
  const [show, setShow] = useState(false);
  const [color, setColor] = useState<string>();
  useEffect(() => {
    setColor(props.color);
  }, [props]);
  const onColorChange: ColorChangeHandler = (c) => {
    setColor(c.hex);
    props.onChange(c.hex);
  };
  return (
    <div>
      <button onClick={() => setShow(true)} role="button" type="button">
        <div className="bg-white p-2 border inline-block rounded-lg">
          <div
            className="w-16 h-8"
            style={{
              backgroundColor: color,
            }}
          />
        </div>
      </button>
      {show ? (
        <>
          <div className="fixed w-screen h-screen top-0 left-0" onClick={() => setShow(false)}></div>
          <div className="absolute">
            <SketchPicker color={color} onChange={onColorChange} />
          </div>
        </>
      ) : null}
    </div>
  );
};
