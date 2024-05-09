import { FC, useState } from "react";
import styled, { ThemeProvider } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      red: string
    }
  }
}

const theme = {
  colors: {
    red: "#ff0000",
  },
};

const Title = styled.h3<{isBig?: boolean}>`
  color: ${({theme}) => theme.colors.red};
  font-size: ${({isBig}) => isBig ? "60px" : "20px"};
`

const App: FC = () => {
  const [isBig, setBig] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <Title isBig={isBig}>{isBig ? "Большой" : "Маленький"} текст</Title>
      <button onClick={() => setBig(!isBig)}>Изменить размер</button>
    </ThemeProvider>
  );
};

export default App;
