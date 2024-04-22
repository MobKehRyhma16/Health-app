import React from "react";
import { Svg, Path } from 'react-native-svg';

const CustomMarker= ({ width, height, svgPath }) => (
    <Svg width={width} height={height}>
        <Path d={svgPath} fill="currentColor" />
    </Svg>
)

export default CustomMarker;