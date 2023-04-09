import React, { FC, useState } from "react";
import { Color, RGBColor } from "react-color";
import { ColorChangeHandler, SketchPicker } from "react-color";

export interface ColorPickerProps {}

const DEFAULT_COLOR = {
  r: 241,
  g: 112,
  b: 19,
  a: 1,
};

export const ColorPicker: FC<ColorPickerProps> = (props) => {
  const [show, setShow] = useState(false);
  const [color, setColor] = useState<RGBColor>(DEFAULT_COLOR);
  const onChange: ColorChangeHandler = (c) => {
    console.log(c);
    setColor(c.rgb);
  };
  return (
    <div>
      <button onClick={() => setShow(true)}>
        <div className="bg-white p-2 border inline-block rounded-lg">
          <div
            className="w-16 h-8"
            style={{
              backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
            }}
          />
        </div>
      </button>
      {show ? (
        <>
          <div className="fixed w-screen h-screen top-0 left-0" onClick={() => setShow(false)}></div>
          <div className="absolute">
            <SketchPicker color={color} onChange={onChange} />
          </div>
        </>
      ) : null}
    </div>
  );
};
