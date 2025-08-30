import { Text, useColorModeValue } from "@chakra-ui/react";
import { type ReactNode } from "react";


import type { TextProps } from "@chakra-ui/react";

interface BizBoardTextProps extends TextProps {
  children?: ReactNode;
}

const BizBoardText = ({
  as = "span",
  fontSize = "2xl",
  fontWeight = "bold",
  textShadow,
  textAlign = "left",
  children,
  ...rest
}: BizBoardTextProps) => {
  const bizColor = useColorModeValue("#F7941D", "#FBC566"); // custom only here
  const boardColor = useColorModeValue("#1A365D", "#90CDF4");
  

  return (
    <Text
      as={as}
      fontSize={fontSize}
      fontWeight={fontWeight}
      textShadow={textShadow}
      textAlign={textAlign}
      {...rest}
    >
      <Text as="span" color={bizColor}>
        {"Biz"}
      </Text>
      <Text as="span" color={boardColor}>
        {"Board"}
      </Text>
      {children}
    </Text>
  );
};

export default BizBoardText;
